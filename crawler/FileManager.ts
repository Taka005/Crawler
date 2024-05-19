import fs from "fs";
import log from "./Log";

interface FileManager{
  host: string;
  sitePath: string;
  savePath: string;
  indexPath: string;
}

type SiteData = {
  host: string;
  pages: PageData[]
}

type PageData = {
  path: string;
  id: string;
  title: string | null;
  description: string | null;
  links: string[];
  images: string[];
  createAt: Date;
}

type IndexData = {
  [key: string]: SiteData;
}

class FileManager{
  constructor(host: string){
    this.host = host;

    this.savePath = `./storage/${this.host}`;
    this.indexPath = "./storage/index.json";

    fs.mkdirSync(this.savePath,{ recursive: true });
    this.addFile(this.indexPath,JSON.stringify({}));
  }

  getThumbnailPath(id: string): string{
    return `${this.savePath}/${id}.png`;
  }

  getPDFPath(id: string): string{
    return `${this.savePath}/${id}.pdf`;
  }

  getIndex(): IndexData{
    return JSON.parse(fs.readFileSync(this.indexPath,"utf8"));
  }

  addIndex(host: string): void{
    const index: IndexData = this.getIndex();

    index[this.host] = {
      host: host,
      pages: []
    } as SiteData;

    this.addFile(this.indexPath,JSON.stringify(index,null,"    "),true)

    log.debug(`"${this.host}"のインデックスを作成しました`);
  }

  addPage(data: PageData): void{
    const index: IndexData = this.getIndex();

    index[this.host].pages.push(data);

    this.addFile(this.indexPath,JSON.stringify(index,null,"   "),true)

    log.debug(`"${data.path}"のページを追加しました`);
  }

  addSiteDir(path: string): void{
    fs.mkdirSync(`${this.sitePath}/${path}`,{ recursive: true});
  }

  addFile(path: string,data: string | NodeJS.ArrayBufferView,force: boolean = false): void{
    if(!fs.existsSync(path)||force){
      fs.writeFileSync(path,data);

      log.debug(`${path}を${force ? "更新" : "新規作成"}しました`);
    }
  }

  getPage(path: string): PageData | null{
    const index: IndexData = this.getIndex();

    return index[this.host].pages.find(page=>page.path === path) || null;
  }
}

export default FileManager;