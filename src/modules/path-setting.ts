import * as path from "path";

export class LinkAwaitPath{
    public get download(): string{
        return path.resolve("") + "/links/await/download/";
    }

    public get save(): string{
        return path.resolve("") + "/links/await/save/";
    }
}

export class LinksPath{
    public get fault(): string{
        return path.resolve("") + "/links/fault/";
    }

    public get finish(): string{
        return path.resolve("") + "/links/finish/";
    }

    public get replicate(): string{
        return path.resolve("") + "/links/replicate/";
    }

    public get await(): LinkAwaitPath{
        return new LinkAwaitPath();
    }
}

export class BrowserPath{
    public get chrome(): string{
        return path.resolve("../chrome");
    }

    public get chromeDriver(): string{
        return this.chrome + "/chromedriver.exe";
    }
}

export class PathSetting{
    public static get BrowserPath(): BrowserPath{
        return new BrowserPath();
    }
    
    public static get Links(): LinksPath{
        return new LinksPath();
    }
}