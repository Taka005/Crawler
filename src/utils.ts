import crypto from "crypto";
import config from "./config";

function parseFilePath(path: string): string{
  return path === "/" ? "/index.html" : path
}

function getSLD(host: string): string | null{
  const parts = host.split(".");
  if(parts.length < 2){
    return null;
  }

  return parts.slice(-2).join(".");
}

function isSameDomain(source: URL,target: URL): boolean{
  if(config.isOnlySameDomain){
    return source.hostname === target.hostname;
  }else{
    const sld1 = getSLD(source.hostname);
    const sld2 = getSLD(target.hostname);
    if(!sld1||!sld2) return false;

    return sld1 === sld2;
  }
}

function isValidURL(value: string): boolean{
  try{
    new URL(value);
    return true;
  }catch{
    return false;
  }
}

function createId(value: string): string{
  const id = crypto.createHash("md5")
    .update(value)
    .digest("hex");

  return id;
}

export default { parseFilePath, getSLD, isSameDomain, isValidURL, createId };