import * as fs from "fs";

import { Link } from "./link";
import { PathSetting } from "./path-setting";
import { LinkType } from "./link-type";

export class Links{
    private _sourceItems: Link[] = new Array<Link>();
    private _singleItems: Link[] = new Array<Link>();

    constructor(){
        this._sourceItems = this.buildLinks(PathSetting.Links.await.download).concat(this.buildLinks(PathSetting.Links.await.save));
        this.tidy();
    }

    public get items(): Link[]{
        return this._singleItems;
    }

    private tidy(): void {
        this._sourceItems.forEach(item => {
            let replicateItemIndex = this._singleItems.findIndex(singleItem => singleItem.url == item.url);
            let sourceItem = this._sourceItems[replicateItemIndex];
            if (replicateItemIndex > -1) fs.renameSync(item.path, `${PathSetting.Links.replicate}${LinkType[sourceItem.type]}-${sourceItem.fileName}-${LinkType[item.type]}-${item.fileName}`);
            else this._singleItems.push(item);
        })
    }

    private buildLinks(awaitLinkPath: string): Link[]{
        if (fs.existsSync(awaitLinkPath)) return fs.readdirSync(awaitLinkPath)
                                                   .map(file => new Link(awaitLinkPath + file))
                                                   .filter(link => link.check());
        else return [];
    }
}