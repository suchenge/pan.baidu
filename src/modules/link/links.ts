import * as fs from "fs";

import { Link } from "./link";
import { LinksPath } from "../settings/path-setting";

export class Links{
    private _items: Link[] = new Array<Link>()

    constructor(private linkFolder: string){
        this._items = this.buildLinks(LinksPath.await + this.linkFolder + "/");
    }

    public get items(): Link[]{
        return this._items;
    }

    /*
    //link去重
    private tidy(): void {
        this._sourceItems.forEach(item => {
            let replicateItemIndex = this._singleItems.findIndex(singleItem => singleItem.url == item.url);
            let sourceItem = this._sourceItems[replicateItemIndex];
            if (replicateItemIndex > -1) fs.renameSync(item.path, `${PathSetting.Links.replicate}${LinkType[sourceItem.type]}-${sourceItem.fileName}-${LinkType[item.type]}-${item.fileName}`);
            else this._singleItems.push(item);
        })
    }
    */

    private buildLinks(awaitLinkPath: string): Link[]{
        if (fs.existsSync(awaitLinkPath)) return fs.readdirSync(awaitLinkPath)
                                                   .map(file => new Link(awaitLinkPath + file, this.linkFolder))
                                                   .filter(link => link.check());
        else return [];
    }
}

export class LinksExtension{
    public static GroupByThread(links: Link[], threadCount: number): Array<Link[]>{
        let result = new Array<Link[]>();

        if (threadCount <= 1) {
            result.push(links);
            return result;
        }

        let tempLinks: Link[] = new Array<Link>();
        let groupCount = Math.ceil(links.length / threadCount);

        for (let i = 0; i < links.length; i++) {
            tempLinks.push(links[i]);
            if (tempLinks.length == groupCount || i == (links.length - 1)){
                result.push(tempLinks);
                tempLinks = new Array<Link>();
            }
        }

        return result;
    }
}