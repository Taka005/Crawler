import { Command } from "commander";
import puppeteer, { Browser } from "puppeteer";
import Crawler from "./Crawler";

type CrawlOption = {
  url: string;
}

const program: Command = new Command();

program
  .requiredOption("-u, --url <url>","クロールするURL")
  .action(async(options: CrawlOption)=>{
    const url: string = options.url;

    const browser: Browser = await puppeteer.launch({
      args:["--lang=ja"]
    });

    const crawler: Crawler = new Crawler(browser,url);
    await crawler.start();
  });

program.parse();