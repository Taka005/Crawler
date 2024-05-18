import config from "./config";

class Log{
  static getDate(): string{
    const now: Date = new Date();
    return `\x1b[32m[${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;
  }

  static info(message: string): void{
    console.log(`\x1b[32m${this.getDate()} [INFO] ${message}\x1b[39m`);
  }

  static warn(message: string): void{
    console.warn(`\x1b[33m${this.getDate()} [WARN] ${message}\x1b[39m`);
  }

  static error(message: string): void{
    console.error(`\x1b[31m${this.getDate()} [ERROR] ${message}\x1b[39m`);
  }

  static debug(message: string): void{
    if(!config.isDebug) return;

    console.debug(`\x1b[34m${this.getDate()} [DEBUG] ${message}\x1b[39m`);
  }
}

export default Log;