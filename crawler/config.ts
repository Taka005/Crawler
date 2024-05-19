type Config = {
  crawlLimit: number;
  crawlInterval: number;
  waitTime: number;
  isOnlySameDomain: boolean;
  isOverWrite: boolean;
  userAgent: string | null;
  isDebug: boolean;
}

const config: Config = {
  crawlLimit: 3,
  crawlInterval: 8000,
  waitTime: 0,
  isOnlySameDomain: true,
  isOverWrite: true,
  userAgent: null,
  isDebug: false
}

export default config;