type config = {
  crawlLimit: number;
  crawlInterval: number;
  userAgent?: string;
}

const config = {
  crawlLimit: 3,
  crawlInterval: 8000
}

export default config;