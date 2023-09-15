const DbHelper = require("../utils/mongo.util");
const { httpLogger } = require("../utils/logger.util");

const LoggerMiddleware = (req, res, next) => {
  httpLogger.log({
    level: "http",
    message: JSON.stringify({
      remoteAddress: req.socket.remoteAddress,
      ip: req.ip,
      httpVersion: req.httpVersion,
      method: req.method,
      url: req.originalUrl,
      rawHeaders: req.rawHeaders
    })
  });
  return next();
};
module.exports = { LoggerMiddleware };
