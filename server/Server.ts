import fs from "fs";
import express from "express";
import log from "../crawler/Log";

interface Server{
  app: express.Express;
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

class Server{
  constructor(port: number){
    this.app = express();

    this.app.set("view engine","ejs");
    this.app.use(express.static("storage"));

    this.app.listen(port,()=>{
      log.info(`${port}番ポートで起動しました`);
    });

    this.app.use((req: express.Request,res: express.Response,next: express.NextFunction)=>{
      log.info(`${req.ip} - [${req.method}] ${req.originalUrl}`);
    
      next();
    });

    this.app.get("/",(req: express.Request,res: express.Response)=>{
      res.render("index",{
        index: this.getIndex()
      });
    });

    this.app.get("/site/:host",(req: express.Request,res: express.Response)=>{
      if(!req.params.host) return;

      res.render("site",{
        host: req.params.host,
        pages: this.getPages(req.params.host) || []
      });
    });

    this.app.get("/site/:host/page/:id",(req: express.Request,res: express.Response)=>{
      if(!req.params.host||!req.params.id) return;

      res.render("page",{
        host: req.params.host,
        page: this.getPage(req.params.host,req.params.id) || []
      });
    });

    this.app.use((req: express.Request,res: express.Response)=>{
      res.status(400);
      res.render("error",{
        error:{
          "message": "404 NOT FOUND"
        }
      });
    });
    
    this.app.use((err: Error,req: express.Request,res: express.Response)=>{
      res.status(500);
      res.render("error",{
        error:{
          "message": err.message,
          "stack": err.stack
        }
      });
    });
  }

  getIndex(): IndexData{
    return JSON.parse(fs.readFileSync("./storage/index.json","utf8"));
  }

  getPages(host: string): PageData[] | null{
    const index: IndexData = this.getIndex();
    if(!index[host]) return null;

    return index[host].pages || null;
  }

  getPage(host: string,id: string): PageData | null{
    const pages: PageData[] | null = this.getPages(host);
    if(!pages) return null;

    return pages.find(page=>page.id === id) || null;
  }
}

export default Server;