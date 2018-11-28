import * as fs from "fs";
import * as path from "path";
import * as iconvLite from "iconv-lite";

import { LinkType } from './link-type';
import { PathSetting } from "./path-setting";

export class Link{
    private _url: string;
    private _password: string;
    private _path: string;
    private _fileName: string;
    private _type: LinkType;

    private resolvesPattern: RegExp = /.*：(http[s]{0,1}:\/\/pan.baidu.com\/s\/.*) .*：([0-9a-zA-Z]{4})/;

    public get path(): string{
        return this._path;
    }

    public get password(): string{
        return this._password;
    }

    public get url(): string{
        return this._url;
    }

    public get type(): LinkType{
        return this._type;
    }

    public get fileName(): string{
        return this._fileName;
    }

    constructor(filePath: string){
        this._path = filePath;
        this._fileName = path.basename(filePath);

        if (this._path.includes(PathSetting.Links.await.download)) this._type = LinkType.download;
        else this._type = LinkType.save;

        let contentBuffer: Buffer = fs.readFileSync(this._path);
        let contentText: string = iconvLite.decode(contentBuffer, "GBK");

        if (!contentText) return this.faultLink();

        contentText = contentText.replace("\n","").replace("\r","").replace("\r\n","").trim();
        if (!this.resolvesPattern.test(contentText)) return this.faultLink();

        let matchItem: RegExpMatchArray = contentText.match(this.resolvesPattern);
        this._url = matchItem[1].trim();
        this._password = matchItem[2].trim();
    }

    private faultLink(): Link{
        fs.renameSync(this._path, PathSetting.Links.fault + this._fileName);
        return null;
    }
}