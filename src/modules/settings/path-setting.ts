import * as path from "path";

export class LinksPath{
    public static get fault(): string{
        return path.resolve("") + "/links/fault/";
    }

    public static get finish(): string{
        return path.resolve("") + "/links/finish/";
    }

    public static get replicate(): string{
        return path.resolve("") + "/links/replicate/";
    }

    public static get await(): string{
        return path.resolve("") + "/links/await/";
    }
}

export class BrowserPath{
    public get chrome(): string{
        return path.resolve("../../chrome");
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