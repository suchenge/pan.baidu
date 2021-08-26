import * as fs from "fs";
import * as path from "path";
import * as iconvLite from "iconv-lite";

import { LinksPath } from "../settings/path-setting";

export class Link{
    private _url: string;
    private _password: string;
    private _path: string;
    private _fileName: string;
    private _type: string;

    private resolvesPattern: RegExp = /.*[:|：](http[s]{0,1}:\/\/pan.baidu.com\/.*) .*[:|：]([0-9a-zA-Z]{4})/;
    private singleUrlPattern: RegExp = /(http[s]{0,1}:\/\/pan.baidu.com\/.*)/;
    private singlePassword: RegExp = /(\w)/;

    public get path(): string{
        return this._path;
    }

    public get password(): string{
        return this._password;
    }

    public get url(): string{
        return this._url;
    }

    public get type(): string{
        return this._type;
    }

    public get fileName(): string{
        return this._fileName;
    }

    public fault(faultType = ""): void{
        let type = faultType == "" ? "": faultType + "-";
        fs.renameSync(this.path, LinksPath.fault + this._type + "/" + type + this._fileName);
    }

    public finish(): void{
        fs.renameSync(this.path, LinksPath.finish + this._type + "/" + this._fileName);
    }

    public check(): boolean{
        return this._url && this._url != ""
                && this._password && this._password != ""
                && this._path && this._path != ""
                && this._fileName && this._fileName != "" 
    }

    private formatUrl(content: string): string{
        let result = "";

        for(let i = 0; i < content.length; i ++){
            let contentIndex: string = content[i];
            
            if (/\u0000/.test(contentIndex)) continue;
            if(/[a-zA-Z]|:|：|\/|\.|[0-9]/.test(contentIndex)){
                result += contentIndex;
            }
        }

        return result;
    }

    private formatPassword(content: string): string{
        let result = "";
        let newContent = content.split("").reverse().join("");
        for(let i = 0; i < newContent.length; i ++){
            let contentIndex: string = newContent[i];

            if (/\u0000/.test(contentIndex)) continue;
            if(/[a-zA-Z]|[0-9]/.test(contentIndex)){
                result += contentIndex;
            }else break;
        }

        result = result.split("").reverse().join("");
        return result;
    }


    constructor(filePath: string, fileFolder){
        this._path = filePath;
        this._fileName = path.basename(filePath);
        this._type = fileFolder;

        try{
            let contentBuffer: Buffer = fs.readFileSync(this._path);
            let contentText: string = iconvLite.decode(contentBuffer, "GBK");
    
            contentText = contentText.replace("\n","")
                                     .replace("\r","")
                                     .replace("\r\n","")
                                     .trim();
    
            let matchItems: RegExpMatchArray = contentText.match(this.resolvesPattern);
            if (matchItems == null){
                let contentArray: string[] = contentText.split(" ");

                this._url  = this.formatUrl(contentArray[0]);
                this._password = this.formatPassword(contentArray[1]);
            }else{
                this._url = matchItems[1].trim();
                this._password = matchItems[2].trim();
            }
        }catch(ex){
            this.fault();
        }
    }
}