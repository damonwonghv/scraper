//Import plugin
require("dotenv").config();
var path = require("path");
const createError = require("http-errors");
const express = require("express");
const http = require("http");

//End import plugin

//Config
global.appRoot = path.resolve(__dirname);
global.appName = process.env.APP_NAME || "framework";
global.sysRole = "sysadmin";
const httpPort = process.env.HTTP_PORT || 3000;
//End config

//Import from Framework
const DbHelper = require("./src/utils/mongo.util");
const { logger } = require("./src/utils/logger.util");
const RedisHelper = require("./src/utils/redis.util");
const TokenHelper = require("./src/utils/token.util");
const RoleController = require("./src/controllers/role.controller");
const UserController = require("./src/controllers/user.controller");
const mainRouter = require("./src/routes/index");
const Scheduler = require("./src/controllers/scheduler.controller");
const hkfmScraper = require("./src/controllers/modules/hkfm/scraper");
//End import from Framework

const app = express();
const db = new DbHelper();
const redis = new RedisHelper();
const token = new TokenHelper();
const httpServer = http.createServer(app);

if (typeof REDIS_HOST == "string" && REDIS_HOST != "") {
  redis
    .connect()
    .then(() => {
      console.log("======Redis connected!======");
    })
    .catch((err) => {
      logger.error(`Redis connection failed`);
      console.error(err);
      throw err;
    });
}
db.connect()
  .then(() => {
    console.log("======Mongo DB connected!======");
    RoleController.CheckSystemAdmin()
      .then(() => {
        UserController.CheckRootAccount().catch((err) => {
          logger.error(err);
          console.error(err);
        });
      })
      .catch((err) => {
        logger.error(`${err}`);
        console.error(err);
      });
    //hkfm Scraper
    hkfmScraper.GetCategory();
    hkfmScraper.GetHomePage();
    //hkfmScraper.DownloadTask();
    //Scheduler
    Scheduler.ScrapCategoryHkfm();
    Scheduler.ScrapPageHkfm();
    Scheduler.DownloadHkfm();
  })
  .catch((err) => {
    logger.error(`Mongo DB connection failed`);
    console.error(err);
    throw err;
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", mainRouter);

app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});

httpServer.listen(httpPort, () => {
  logger.info(`Port listening ${httpPort}`);
});

process.on("SIGINT", () => {
  logger.info("======Server stopped======");
  httpServer.close();
  process.exit(0);
});
