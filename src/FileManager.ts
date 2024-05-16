import fs from "fs";
import log from "./Log";

interface FileManager{
  url: URL,
  sitePath: string,
  imagePath: string,
  indexPath: string
}

type SiteData = {
  host: string,
  title: string | null,
  description: string | null,
  thumbnail: string,
  files: string[],
  images: string[],
  createAt: Date
}

class FileManager{
  constructor(url: URL){
    this.url = url;

    this.sitePath = `./storage/sites/${this.url.host}`;
    this.imagePath = `./storage/images/${this.url.host}`;
    this.indexPath = "./storage/index.json";

    fs.mkdirSync(this.sitePath,{ recursive: true });
    fs.mkdirSync(this.imagePath,{ recursive: true });
    this.addFile(this.indexPath,JSON.stringify([]));
  }

  get thumbnailPath(): string{
    return `${this.imagePath}/${this.url.host}.png`;
  }

  addIndex(data: SiteData): void{
    const index = JSON.parse(fs.readFileSync(this.indexPath,"utf8"));

    index.push(data);
  }

  addSiteDir(path: string): void{
    fs.mkdirSync(`${this.sitePath}/${path}`,{ recursive: true});
  }

  addFile(path: string,data: string | NodeJS.ArrayBufferView,force: boolean = false): void{
    if(!fs.existsSync(path)||force){
      fs.writeFileSync(path,data);

      log.info(`${path}を新規作成しました`);
    }
  }
}

export default FileManager;