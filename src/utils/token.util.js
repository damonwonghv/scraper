const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const { logger } = require("./logger.util");
const { GenerateKeyPair } = require("./key.util");

class TokenHelper {
  constructor() {
    this.keyPath = path.join(
      appRoot,
      `${process.env.KEY_PATH}/token/` || "keys/token/"
    );
    this.privateKeyFilename = "privateKey.key";
    this.publicKeyFilename = "publicKey.key";
    this.privateKey = null;
    this.publicKey = null;
    this.checkKeyPath();
    this.keyInit();
  }
  checkKeyPath() {
    if (!fs.existsSync(this.keyPath)) {
      fs.mkdirSync(this.keyPath, { recursive: true });
      logger.info("Token key path created!");
    }
  }
  async keyInit() {
    try {
      const privatePath = path.join(this.keyPath, this.privateKeyFilename);
      const publicPath = path.join(this.keyPath, this.publicKeyFilename);
      if (fs.existsSync(privatePath) && fs.existsSync(publicPath)) {
        this.privateKey = fs.readFileSync(privatePath).toString();
        this.publicKey = fs.readFileSync(publicPath).toString();
      } else {
        //generate key
        const keys = await GenerateKeyPair();
        this.privateKey = keys.privateKey;
        this.publicKey = keys.publicKey;
        fs.writeFileSync(privatePath, keys.privateKey);
        fs.writeFileSync(publicPath, keys.publicKey);
        logger.info(`Token keys pair created`);
        return Promise.resolve();
      }
    } catch (err) {
      logger.error(`Token error: ${err}`);
      return Promise.reject(err);
    }
  }
  async signToken(payload) {
    return jwt.sign(payload, this.privateKey, { algorithm: "RS256" });
  }
}
module.exports = TokenHelper;
