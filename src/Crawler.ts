import path from "path";
import { Page, Browser } from "puppeteer";
import fm from "./SiteManager";

interface Crawler{
  browser: Browser
  url: URL,
  sitePath: string,
  imagePath: string
}

class Crawler{
  constructor(browser: Browser,url: string){
    this.browser = browser;
    this.url = new URL(url);

    this.sitePath = `../storage/sites/${this.url.hostname}`;
    this.imagePath = `../storage/sites/${this.url.hostname}`;


    fm.mkDir(this.sitePath);
    fm.mkDir(this.imagePath);
  }

  async run(): Promise<void>{
    const page: Page = await this.browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.goto(this.url.href);

    page.on("response",async(res)=>{
      const buffer: Buffer = await res.buffer();
      const url: URL = new URL(res.url());

      fm.mkDir(`${this.sitePath}/${path.dirname(url.pathname)}`);
      fm.addFile(`${this.sitePath}/${url.pathname}`,buffer);
    })
  }

  async shot(page: Page): Promise<void>{
    await page.screenshot({ path: `${this.imagePath}/${this.url.hostname}.png`, fullPage: true });
  }

  async scrollAll(page: Page): Promise<void>{
    await page.evaluate(async()=>{
      await new Promise<void>((resolve)=>{
        let totalHeight: number = 0
        const distance: number = 100
        const timer: NodeJS.Timeout = setInterval(()=>{
          const scrollHeight: number = document.body.scrollHeight;
          scrollBy(0,distance);
          totalHeight += distance;
          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve();
          }
        },100);
      });

      scrollBy(0,0);
    });
  }
}

export default Crawler;