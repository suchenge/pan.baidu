import {Link} from "../link/link";

import {CrawlerBehaviorBase} from "./crawler-behavior-base";
import {CrawlerBehaviorSetting} from "./crawler-behavior-setting";
import {Browser} from "../browser";

export class CrawlerBehaviorFactory{
    public static create(link: Link, browser: Browser): CrawlerBehaviorBase{
        let behavior = CrawlerBehaviorSetting.items.get(link.type);
        // @ts-ignore
        return behavior(link, browser);
    }
}