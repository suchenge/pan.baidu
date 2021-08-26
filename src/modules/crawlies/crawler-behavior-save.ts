import * as selenium from "selenium-webdriver";

import { Link } from "../link/link";
import { CrawlerBehaviorBase } from "./crawler-behavior-base";
import {Browser} from "../browser";

export class CrawlerBehaviorSave extends CrawlerBehaviorBase {
    constructor(protected link: Link, protected browser: Browser) {
        super(link, browser);
    }

    public override async operation(): Promise<void> {
        //点击保存到网盘按钮
        let saveButton = await this.browser.findElement(selenium.By.xpath("//a[@title='保存到网盘']"));
        await saveButton.click();

        //选择保存到图片文件夹
        let pictureLi = await this.browser.findElement(selenium.By.xpath("//ul[contains(@class,'treeview-root-content')]/li[5]"));
        await pictureLi.click();

        //点击确定按钮
        let confirmA = await this.browser.findElement(selenium.By.xpath("//a[@title='确定']"));
        await confirmA.click();
    }
}