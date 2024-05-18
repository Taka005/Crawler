type Config = {
  crawlLimit: number;
  crawlInterval: number;
  isOnlySameDomain: boolean;
  userAgent: string | null;
  isDebug: boolean; 
}

const config: Config = {
  crawlLimit: 3,
  crawlInterval: 8000,
  isOnlySameDomain: true,
  userAgent: null,
  isDebug: false
}

export default config;