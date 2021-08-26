import {WebSiteSetting} from "../settings/website-setting";
import {Browser} from "../browser";
import {Link} from "../link/link";

import {CrawlerBehaviorBase} from "./crawler-behavior-base";
import {CrawlerBehaviorFactory} from "./crawler-behavior-factory";

export class Crawler {
    constructor(private links: Link[]
                , private linkType: string
                , private browser: Browser = new Browser()) {
    }

    public async login(): Promise<void> {
        try {
            await this.browser.get(WebSiteSetting.indexUrl);
            await this.browser.addCookie(WebSiteSetting.cookie);
        }catch (e) {
            throw e;
        }
    }

    public async grab(): Promise<void> {
        //登录
        await this.login();

        for (let i = 0; i < this.links.length; i++) {
            let behavior: CrawlerBehaviorBase = CrawlerBehaviorFactory.create(this.links[i], this.browser);
            await behavior.extract();
        }
        await this.browser.quit();
    }
}