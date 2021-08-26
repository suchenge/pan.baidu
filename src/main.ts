import { Link } from "./modules/link/link";
import { Links, LinksExtension } from "./modules/link/links";
import { Crawler } from "./modules/crawlies/crawler";
import { CrawlerBehaviorSetting } from "./modules/crawlies/crawler-behavior-setting";

//线程数
let threadCount: number = 5;

(async() => {
    for (let linkFolder of CrawlerBehaviorSetting.items.keys()) {
        let links: Link[] = new Links(linkFolder).items;

        if (links.length > 0){
            let linksByThread: Array<Link[]> = LinksExtension.GroupByThread(links, threadCount);

            for (let i = 0; i < linksByThread.length; i++) {
                let crawler: Crawler = new Crawler(linksByThread[i], linkFolder);
                crawler.grab();
            }
        }
    }
})();



