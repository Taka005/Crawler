import path from "path";
import { Page, Browser, HTTPResponse } from "puppeteer";
import FileManager from "./FileManager";
import log from "./Log";

interface Crawler{
  browser: Browser
  url: URL,
  manager: FileManager
}

class Crawler{
  constructor(browser: Browser,url: string){
    this.browser = browser;
    this.url = new URL(url);
    this.manager = new FileManager(this.url);

    log.info("クローラーが起動しました");
  }

  async run(): Promise<void>{
    log.info(`クローラーを"${this.url.host}"で実行します`);

    const page: Page = await this.browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.goto(this.url.href);

    page.on("response",async(res: HTTPResponse)=>{
      const buffer: Buffer = await res.buffer();
      const url: URL = new URL(res.url());

      if(url.host !== this.url.host) return;

      //fm.mkDir(`${this.sitePath}/${path.dirname(url.pathname)}`);
      //fm.addFile(`${this.sitePath}/${url.pathname}`,buffer);
    });

    await this.scrollAll(page);
    await this.getThumbnail(page);
  }

  async getThumbnail(page: Page): Promise<void>{
    await page.screenshot({ path: this.manager.thumbnailPath, fullPage: true });
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

      scrollTo(0,0);
    });
  }
}

export default Crawler;