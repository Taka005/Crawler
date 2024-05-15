import fs from "node:fs";

interface SiteManager{

}

class SiteManager{
  static mkDir(path: string): void{
    if(!fs.existsSync(path)){
      fs.mkdirSync(path,{ recursive: true });
    }
  }

  static addFile(path: string,data: string | NodeJS.ArrayBufferView): void{
    fs.writeFileSync(path,data);
  }
}

export default SiteManager;