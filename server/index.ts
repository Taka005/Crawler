import { Command } from "commander";
import Server from "./Server";

type ServerOption = {
  port: number;
}

const program: Command = new Command();

program
  .option("-p, --port <url>","クロールするURL","8000")
  .action(async(options: ServerOption)=>{
    const port: number = options.port;

    new Server(port);
  });

program.parse();