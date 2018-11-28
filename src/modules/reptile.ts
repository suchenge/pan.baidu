import { PathSetting } from "./path-setting";
import { Link } from "./link";

export class Reptile{
    private driver: selenium.WebDriver;

    constructor(links: Link[], driver: selenium.WebDriver){
        this.driver = driver;
        this.driver.get("https://www.baidu.com")
    }
}