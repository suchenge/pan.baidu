import * as selenium from 'selenium-webdriver';

import { Link } from "./link";
import { LinkType } from './link-type';
import { PathSetting } from "./path-setting";
import { Utilites } from './utilites';
import { Log, LogType } from "./log";

export class Reptile{
    constructor(private link: Link, private driver: selenium.WebDriver){}

    public static async batchGrab(links: Link[], driver: selenium.WebDriver): Promise<void>{
        return new Promise<void>(async (resolve, reject) => {
            for(let link of links){
                await new Reptile(link, driver).grab();
            }
            await driver.close();
            resolve();
        })
    }

    public async grab(): Promise<void>{
        return new Promise<void>((resolve, reject) => {
            this.link.open();
            this.driver.get(this.link.url).then(() => {
                this.driver.findElement(selenium.By.xpath("//form/div/dl/dd/input")).then(input => {
                    input.sendKeys(this.link.password).then(() => {
                        this.driver.findElement(selenium.By.xpath("//a[@title='提取文件']")).then(button => {
                            button.click().then(async () => {
                                await this.select();
                                resolve();
                            }).catch(() => {
                                this.link.fault();
                                resolve();
                            });
                        }, () => {
                            this.link.fault();
                            resolve();
                        });
                    }).catch(() => {
                        this.link.fault();
                        resolve();
                    });
                }, async () => {
                    await this.select();
                    resolve();
                });
            });
        });
    }

    private async select(): Promise<void>{
        return new Promise<void>((resolve, reject) => {
            this.driver.findElement(selenium.By.xpath("//div[@node-type=\'fydGNC\']")).then(checkbox => {
                checkbox.click().then(async () => {
                    if (this.link.type == LinkType.download) await this.download();
                    else await this.save();
                    resolve();
                }).catch(() => {
                    this.link.fault();
                    resolve();
                });
            }, async() => {
                if (this.link.type == LinkType.download) await this.download();
                else await this.save();
                resolve();
            });
        })
    }

    private async download(): Promise<void>{
        return new Promise<void>((resolve, reject) => {
            Utilites.sleep(5000);
            this.driver.findElement(selenium.By.xpath("//a[contains(@title,'下载(')]")).then(button => {
                button.click().then(() => {
                    Utilites.sleep(5000);
                    this.link.finish();
                    resolve();
                }).catch(error => {
                    Log.write(LogType.Exception, error);
                    this.link.fault();
                    resolve();
                });
            }, error => {
                Log.write(LogType.Exception, error);
                this.link.fault();
                resolve();
            });
        });
    }

    private async save(): Promise<void>{
        return new Promise<void>((resolve, reject) => {
            Utilites.sleep(5000);
            this.driver.findElement(selenium.By.xpath("//a[@title='保存到网盘']")).then(button => {
                button.click().then(() => {
                    Utilites.sleep(3000);
                    this.driver.findElement(selenium.By.xpath("//a[@title='确定']")).then(a => {
                        a.click().then(() => {
                            Utilites.sleep(3000);
                            this.link.finish();
                            resolve();
                        }).catch(() => {
                            this.link.fault();
                            resolve();
                        });
                    }, () => {
                        this.link.fault();
                        resolve();
                    });
                });
            }, () => {
                this.link.fault();
                resolve();
            });
        });
    }
}