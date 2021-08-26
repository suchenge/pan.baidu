import * as selenium from "selenium-webdriver";

import { Link } from "../link/link";
import { CrawlerBehaviorBase } from "./crawler-behavior-base";
import {Utilites} from "../utilites";
import {Browser} from "../browser";

export class CrawlerBehaviorDownload extends CrawlerBehaviorBase {
    constructor(protected link: Link, protected browser: Browser) {
        super(link, browser);
    }

    public override async operation(): Promise<void> {
        let downloadButton = await this.browser.findElement(selenium.By.xpath("//a[contains(@title,'下载(')]"));
        await downloadButton.click();
        await this.browser.sleep(5000);
    }
}