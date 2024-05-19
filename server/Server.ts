import express from "express";
import log from "crawler/Log";

interface Server{
  app: express.Express;
}

class Server{
  constructor(port: number){
    this.app = express();

    this.app.set("view engine","ejs");
    this.app.listen(port,()=>{
      log.info(`${port}番ポートで起動しました`);
    });

    this.app.get("/",(req: express.Request,res: express.Response)=>{
      res.render("index");
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
}

export default Server;