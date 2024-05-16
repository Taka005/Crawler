import puppeteer, { Browser } from "puppeteer";
import Crawler from "./Crawler";

(async()=>{
    const browser: Browser = await puppeteer.launch();
    const crawler: Crawler = new Crawler(browser,"https://qiita.com/index.html");
    await crawler.run();
})()