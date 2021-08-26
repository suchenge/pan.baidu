import {Link} from "../link/link";

import {CrawlerBehaviorDownload} from "./crawler-behavior-download";
import {CrawlerBehaviorSave} from "./crawler-behavior-save";
import {Browser} from "../browser";

export class CrawlerBehaviorSetting{
    private static _items: Map<string, (link:Link, browser: Browser) => {}> = new Map<string, (link:Link, browser: Browser) => {}>([
        ["download", (link: Link, browser: Browser) => { return new CrawlerBehaviorDownload(link, browser)}],
        ["save", (link: Link, browser: Browser) => { return new CrawlerBehaviorSave(link, browser)}],
    ]);

    public static get items(): Map<string, (link:Link, browser: Browser) => {}>{
        return this._items;
    }
}