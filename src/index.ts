import puppeteer, { Browser } from "puppeteer";
import Crawler from "./Crawler";

(async()=>{
    const browser: Browser = await puppeteer.launch();
    const crawler: Crawler = new Crawler(browser,"https://www.takasumibot.com/index.html");
    await crawler.run();
})()