import * as selenium from 'selenium-webdriver';

import {Link} from "../link/link";
import {Log, LogType} from "../log";
import {Browser} from "../browser";

export abstract class CrawlerBehaviorBase {
    protected constructor(protected link: Link, protected browser: Browser) {
    }

    protected operationLogType: string = "finish";

    protected operationLog(operationType: string): void {
        console.log(`${operationType} ${this.link.type}: ${this.link.fileName}`);
    }

    //文件提取
    public async extract(): Promise<void> {
        this.operationLog("begin");

        try {
            //打开文件提取链接
            await this.browser.get(this.link.url);

            //判断是否需要输入提取码
            let pageTitle = await this.browser.getTitle();
            if (pageTitle === "百度网盘 请输入提取码") {
                //输入提取密码
                let input = await this.browser.findElement(selenium.By.xpath("//form/div/dl/dd/input"));
                await input.sendKeys(this.link.password);
                //点击提取按钮
                let button = await this.browser.findElement(selenium.By.xpath("//a[@title='提取文件']"));
                await button.click();
            }

            //await this.driver.sleep(5000);
            //判断文件是否存在
            pageTitle = await this.browser.getTitle();
            if (pageTitle === "百度网盘-链接不存在") {
                this.link.fault("not file");
                this.operationLogType = "fault:not file";
            } else {
                //如果文件有多个，则进行多选
                try {
                    let checkbox = await this.browser.findElement(selenium.By.xpath("//div[@node-type=\'fydGNC\']"));
                    await checkbox.click();
                    //await this.driver.sleep(3000);
                } catch {

                }
                //运行实现类文件操作
                await this.operation();
                //await this.driver.sleep(3000);
                //移动链接文件到完成文件夹
                this.link.finish();
            }
        } catch (error) {
            Log.write(LogType.Exception, this.buildErrorLog(error));
            this.link.fault();

            this.operationLogType = "fault";
        }

        this.operationLog(this.operationLogType);
    }

    private buildErrorLog(error: string): string {
        return "时间:" + new Date().toLocaleString()
            + "\n文件:" + this.link.fileName
            + "\n链接:" + this.link.url
            + "\n密码:" + this.link.password
            + "\n类型:" + this.link.type
            + "\n信息:"
            + "\n" + error;
    }

    abstract operation(): Promise<void>;
}