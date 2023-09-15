const crypto = require("crypto");
const logger = require("./logger.util");

const prime_length = 60;
var diffHell = crypto.createDiffieHellman(prime_length);

const GenerateKeyPair = () => {
  try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem"
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
      }
    });
    return Promise.resolve({
      publicKey: publicKey,
      privateKey: privateKey
    });
  } catch (err) {
    logger.error(err);
    return Promise.reject(err);
  }
};

module.exports = { GenerateKeyPair };
