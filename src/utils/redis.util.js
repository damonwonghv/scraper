const { logger } = require("./logger.util");
const redis = require("redis");

class RedisHelper {
  constructor(host, port) {
    this.host = host || process.env.REDIS_HOST || "127.0.0.1";
    this.port = port || process.env.REDIS_PORT || 6379;
    this.client = null;
    this.maxRetry = 10;
    this.retryCount = 0;
  }

  async connect() {
    this.client = redis.createClient(this.port, this.host);
    this.client.on("error", (err) => {
      this.retryCount++;
      if (this.retryCount < this.maxRetry) {
        this.connect();
      } else {
        logger.error(err);
        return Promise.reject(err);
      }
    });
    await this.client.connect();
    this.retryCount = 0;
  }

  async set(key, value) {
    return await this.client.set(key, value);
  }

  async get(key) {
    return await this.client.set(key);
  }

  close() {
    this.client.quit();
  }
}

module.exports = RedisHelper;
