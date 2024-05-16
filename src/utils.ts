function parseFilePath(path: string): string{
  return path === "/" ? "/index.html" : path
}

function pathToString(path: string): string{
  return path.slice(1).replace(/\//g,".");
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

export default { parseFilePath, pathToString, getSLD, isSameSLD, isValidURL };