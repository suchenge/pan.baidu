import { Link } from "./modules/link";
import { Links } from "./modules/links";
import { LinkType } from './modules/link-type';
import { Reptile } from "./modules/reptile";
import { PathSetting } from './modules/path-setting';
import { Browser } from './modules/browser';

let links: Links = new Links();

if (links.items.length > 0){
    let linkItems: Map<LinkType, Link[]> = new Map<LinkType, Link[]>();
    linkItems.set(LinkType.download, links.items.filter(item => item.type == LinkType.download));
    linkItems.set(LinkType.save, links.items.filter(item => item.type == LinkType.save));

    let count: number = 0;
    linkItems.forEach((value, key) => {
       let driver = new Browser(count).driver;
       driver.get(value[0].url);
       count ++;
    });
}



