const { logger } = require("./logger.util");
const MongoClient = require("mongodb").MongoClient;

class MongoDbHelper {
  constructor(url, dbName, maxRetryCount = 10) {
    this.url = url || process.env.DB_URL;
    this.dbName = dbName || process.env.DB_NAME;
    this.db = null;
    this.client = null;
    this.maxRetryCount = maxRetryCount || 10;
    this.retryCount = 0;
  }

  async connect() {
    try {
      this.client = await MongoClient.connect(this.url);
      this.db = this.client.db(this.dbName);
      this.retryCount = 0;
      return await Promise.resolve();
    } catch (error) {
      this.retryCount++;
      if (this.retryCount < this.maxRetryCount) {
        console.log(`MongoDB retrying times: ${this.retryCount}`);
        return await this.connect();
      } else {
        const errMsg = `Error worth logging: ${error}`;
        logger.error(errMsg);
        return await Promise.reject(error);
      }
    }
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
  }

  async insert(collectionName, doc) {
    const collection = this.db.collection(collectionName);
    return await collection.insertOne(doc);
  }

  async insertMany(collectionName, doc) {
    const collection = this.db.collection(collectionName);
    return await collection.insertMany(doc);
  }

  async find(
    collectionName,
    query = {},
    options = {},
    limit = null,
    sort = null
  ) {
    const collection = this.db.collection(collectionName);
    let res = collection.find(query, options);
    if (sort) res = res.sort(sort);
    if (sort) res = res.limit(limit);
    return await res.toArray();
  }

  async update(collectionName, query, update) {
    const collection = this.db.collection(collectionName);
    return await collection.updateOne(query, { $set: update });
  }

  async remove(collectionName, query) {
    const collection = this.db.collection(collectionName);
    return await collection.deleteOne(query);
  }
  async count(collectionName, filter) {
    const collection = this.db.collection(collectionName);
    return await collection.countDocuments(filter);
  }
}

module.exports = MongoDbHelper;
