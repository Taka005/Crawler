import path from "path";
import { Page, Browser, HTTPResponse } from "puppeteer";
import FileManager from "./FileManager";
import LinkManager from "./LinkManager";
import log from "./Log";
import utils from "./utils";
import config from "./config";

interface Crawler{
  browser: Browser;
  host: string;
  manager: FileManager;
  links: LinkManager;
  completes: string[];
}

class Crawler{
  constructor(browser: Browser,url: string){
    this.browser = browser;

    this.links = new LinkManager();
    this.links.add(url);
    this.host = new URL(url).host;

    this.manager = new FileManager(this.host);

    this.completes = [];

    log.info("クローラーが起動しました");
  }

  async start(): Promise<void>{
    log.info(`クローラーを"${this.host}"で実行します`);

    this.manager.addIndex(this.host);

    const link = this.links.first();
    this.run(new URL(link.url));
    link.setComplete(true);

    setInterval(()=>{
      console.log(this.links.split(config.crawlLimit))
      this.links.split(config.crawlLimit)
        .map(async(link)=>{
          if(link.isComplete) return;

          this.run(new URL(link.url));
          link.setComplete(true);
        });
    },10000);
  }

  async stop(): Promise<void>{
    await this.browser.close();
  }

  async run(url: URL): Promise<void>{
    const page: Page = await this.browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await this.setConfig(page);

    await page.goto(url.href);

    await this.scrollAll(page);
    await this.getThumbnail(page,encodeURIComponent(url.pathname+url.search));

    const links = await this.getLinks(url,page);
    links.forEach(link=>this.links.add(link));

    this.manager.addPage({
      path: utils.parseFilePath(url.pathname+url.search),
      title: await this.getTitle(page),
      description: await this.getDescription(page),
      thumbnail: this.manager.getThumbnailPath(url.pathname+url.search),
      links: links,
      createAt: new Date()
    });

    await page.close();
  }

  async download(page: Page): Promise<void>{
    page.on("response",async(res: HTTPResponse)=>{
      const buffer: Buffer = await res.buffer();
      const url: URL = new URL(res.url());

      if(url.host !== this.host) return;

      this.manager.addSiteDir(path.dirname(url.pathname));
      this.manager.addFile(url.pathname,buffer);
    });
  }

  async getThumbnail(page: Page,path: string): Promise<void>{
    await page.screenshot({ path: this.manager.getThumbnailPath(path), fullPage: true });
  }

  async getTitle(page: Page): Promise<string | null>{
    return await page.evaluate(async()=>{
      return document.title || null;
    });
  }

  async getDescription(page: Page): Promise<string | null>{
    return await page.evaluate(async()=>{
      const meta = document.querySelector("meta[name='description']");
      return meta ? meta.getAttribute("content") : null;
    });
  }

  async getLinks(url: URL,page: Page): Promise<string[]>{
    const links = await page.evaluate(()=>{
      return Array.from(document.querySelectorAll("a"))
        .map(tag=>tag.href)
        .filter(href=>href)
    });

    const urls = links
      .map(link=>{
        if(utils.isValidURL(link)){
          return link
        }else{
          return path.join(url.href,link);
        }
      })
      .filter(link=>utils.isValidURL(link)&&utils.isSameSLD(url,new URL(link)));

    return [...new Set(urls)];
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

  async setConfig(page: Page): Promise<void>{
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36");
    await page.setExtraHTTPHeaders({
      "Accept-Language": "ja-JP,ja;q=0.9"
    });
  }
}

export default Crawler;