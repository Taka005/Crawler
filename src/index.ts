import puppeteer, { Browser } from "puppeteer";
import Crawler from "./Crawler";

(async()=>{
    const browser: Browser = await puppeteer.launch({
      args:["--lang=ja"]
    });
    const crawler: Crawler = new Crawler(browser,"https://www.takasumibot.com/");
    await crawler.start();

    //browser.close();
})()