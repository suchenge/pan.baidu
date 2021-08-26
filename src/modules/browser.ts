import * as selenium from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

import { PathSetting } from './settings/path-setting';
import { By, WebElement } from "selenium-webdriver";

export class Browser{
    constructor(private index: number = 0){
        this._driver = new selenium.Builder().forBrowser("chrome")
                                             .setChromeService(new chrome.ServiceBuilder(PathSetting.BrowserPath.chromeDriver))
                                             .setChromeOptions(new chrome.Options().addArguments('--no-sandbox')
                                                                                   .addArguments('--disable-dev-shm-usage')
                                                                                   .addArguments('blink-settings=imagesEnabled=false')
                                                                                   .addArguments('--headless')
                                                                                   .addArguments('--disable-gpu')
                                                                                   //.addArguments(`--user-data-dir=${PathSetting.BrowserPath.chrome}/${this.index}`)
                                            )
                                            .build();
    }

    private _driver: selenium.WebDriver;

    public get driver(): selenium.WebDriver{
        return this._driver;
    }

    public async sleep(ms: number): Promise<void> {
        await this._driver.sleep(ms);
    }

    public async getTitle(): Promise<string>{
        return await this._driver.getTitle();
    }

    public async get(url: string): Promise<void>{
        await this._driver.get(url);
    }

    public async quit(): Promise<void>{
        await this._driver.quit();
    }

    public async addCookie(cookie: any): Promise<void>{
        let options: selenium.Options = this._driver.manage();
        for (let cookieElement in cookie) {
            await options.addCookie({name:cookieElement, value:cookie[cookieElement]});
        }

    }

    public async findElement(by: By): Promise<WebElement>{
        try{
            return await this._driver.findElement(by);
        }
        catch (error){
        }

        await this._driver.sleep(3000);
        return await this._driver.findElement(by);
    }
}
