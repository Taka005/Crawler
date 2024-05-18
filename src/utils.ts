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

function isSameSLD(source: URL,target: URL): boolean{
  const sld1 = getSLD(source.hostname);
  const sld2 = getSLD(target.hostname);
  return sld1 !== null && sld1 === sld2;
}

function isValidURL(value: string): boolean{
  try{
    new URL(value);
    return true;
  }catch{
    return false;
  }
}

function createId(length: number){
  const str: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id: string = "";
  for(let i = 0;i < length;i++){
    id += str.charAt(Math.floor(Math.random()*str.length));
  }

  return id;
}

export default { parseFilePath, getSLD, isSameSLD, isValidURL, createId };