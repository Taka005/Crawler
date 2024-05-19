import path from "path";
import { Page, Browser } from "puppeteer";
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
}

class Crawler{
  constructor(browser: Browser,url: string){
    this.browser = browser;

    this.links = new LinkManager();
    this.links.add(url);
    this.host = new URL(url).hostname;

    this.manager = new FileManager(this.host);

    log.info("クローラーが起動しました");
  }

  async start(): Promise<void>{
    log.info(`クローラーを"${this.host}"で実行します`);

    if(config.isOverWrite||!this.manager.getIndex()[this.host]){
      this.manager.addIndex(this.host);
    }

    setInterval(()=>{
      this.links.split(config.crawlLimit)
        .map(async(link)=>{
          if(link.isComplete) return;

          this.run(new URL(link.url));
          link.setComplete(true);
        });
    },config.crawlInterval);
  }

  async stop(): Promise<void>{
    await this.browser.close();
  }

  async run(url: URL): Promise<void>{
    log.info(`"${utils.parseFilePath(url.pathname)}${url.search}"をクロールしています`);

    const page: Page = await this.browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await this.setConfig(page);

    await page.goto(url.href);

    await utils.sleep(config.waitTime);

    await this.scrollAll(page);

    const links: string[] = await this.getLinks(page,url);
    links.forEach(link=>{
      if(this.links.get(link)) return;

      this.links.add(link);
    });

    if(!config.isOverWrite&&this.isAccessed(url)) return;

    const path = utils.parseFilePath(url.pathname)+url.search;
    const id: string = utils.createId(path);

    await this.getThumbnail(page,id);
    await this.getPDF(page,id);

    this.manager.addPage({
      path: path,
      id: id,
      title: await page.title(),
      description: await this.getDescription(page),
      thumbnail: this.manager.getThumbnailPath(id),
      view: this.manager.getPDFPath(id),
      links: links,
      images: await this.getImages(page),
      createAt: new Date()
    });

    await page.close();
  }

  isAccessed(url: URL): boolean{
    return !!this.manager.getPage(utils.parseFilePath(url.pathname)+url.search);
  }

  async getThumbnail(page: Page,id: string): Promise<void>{
    await page.screenshot({ path: this.manager.getThumbnailPath(id), fullPage: true });
  }

  async getPDF(page: Page,id: string): Promise<void>{
    await page.emulateMediaType("screen");
    await page.pdf({ path: this.manager.getPDFPath(id) });
  }

  async getDescription(page: Page): Promise<string | null>{
    return await page.evaluate(async()=>{
      const meta = document.querySelector("meta[name='description']");
      return meta ? meta.getAttribute("content") : null;
    });
  }

  async getLinks(page: Page,url: URL): Promise<string[]>{
    const links = await page.evaluate(()=>{
      return Array.from(document.querySelectorAll("a"))
        .map(tag=>tag.href)
        .filter(href=>href);
    });

    const urls = links
      .map(link=>{
        if(utils.isValidURL(link)){
          return link
        }else{
          return path.join(url.href,link);
        }
      })
      .filter(link=>utils.isValidURL(link)&&utils.isSameDomain(url,new URL(link)));

    return [...new Set(urls)];
  }

  async getImages(page: Page): Promise<string[]>{
    return await page.evaluate(()=>{
      return Array.from(document.querySelectorAll("img"))
        .map(img=>img.src)
        .filter(src=>src);
    });
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

      await new Promise<void>((resolve)=>{
        let totalHeight: number = document.body.scrollHeight
        const distance: number = -100
        const timer: NodeJS.Timeout = setInterval(()=>{
          scrollBy(0,distance);
          totalHeight += distance;
          if(totalHeight <= 0){
            clearInterval(timer);
            resolve();
          }
        },100);
      });
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