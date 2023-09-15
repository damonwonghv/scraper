const path = require("path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const logPath = path.join(appRoot, process.env.LOG_PATH || "logs/");

const ignorePrivate = format((info, opts) => {
  if (info.private) {
    return false;
  }
  return info;
});

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ label: appName }), timestamp(), myFormat),
  transports: [
    new transports.File({
      filename: path.join(logPath, "error.log"),
      level: "error"
    }),
    new transports.File({ filename: path.join(logPath, "combined.log") }),
    new transports.Console({
      level: "info",
      format: format.combine(format.colorize(), format.simple())
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logPath, "exceptions.log") })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logPath, "rejections.log") })
  ]
});

const httpLogger = createLogger({
  format: combine(label({ label: appName }), timestamp(), myFormat),
  transports: [
    new transports.File({
      filename: path.join(logPath, "http.log"),
      level: "http"
    })
  ]
});

module.exports = { logger, httpLogger };
