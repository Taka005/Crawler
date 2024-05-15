import puppeteer from "puppeteer";

interface Crawler {
  url: URL
}

class Crawler{
  constructor(url: string){
    this.url = new URL(url);
  }

  async run(): Promise<void>{

  }
}

export default Crawler;