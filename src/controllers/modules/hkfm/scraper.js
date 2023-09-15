const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const commonUtil = require("../../../utils/common.util");
const { logger } = require("../../../utils/logger.util");
const DBHelper = require("../../../utils/mongo.util");
const config = fs.readFileSync(__dirname + "/config.json");
const { DownloadFile } = require("../../../services/download.service");
const downloadPath = path.join(
  appRoot,
  process.env.DOWNLOAD_PATH || "downloads/"
);
const maxDownloadTask = 10;

const GetCategory = async () => {
  const db = new DBHelper();
  await db.connect();
  const dbCategory = await db.find("hkfmCategory", {});
  const endpoint = await JSON.parse(config.toString()).endpoint;
  let instance = axios.create({
    baseURL: endpoint,
    timeout: 1000000
  });
  const result = await instance.get("/");

  const $ = cheerio.load(result.data);
  let result1 = [];

  $(".hfeed div#main #secondary #primary-sidebar aside#categories-2 ul")
    .find("li")
    .each(function () {
      if (dbCategory.find((z) => z.name == $(this).text())) {
      } else {
        result1.push({
          name: $(this).text(),
          href: $(this).children().attr("href"),
          updateDate: commonUtil.GetDateTime().$d
        });
      }
    });

  if (result1.length > 0) {
    await db.insertMany("hkfmCategory", result1);
  }
};

const GetHomePage = async () => {
  try {
    const db = new DBHelper();
    await db.connect();
    const dbCategory = await db.find("hkfmCategory", {});

    if (dbCategory.length > 0) {
      dbCategory.forEach(async (item) => {
        const data = await GetProgram(item.href, item.name);
        const exist = data.map((z) => ({ id: z.id || "" }));
        await db.connect();
        if (exist.length > 0) {
          for (let item of data) {
            const idCount = await db.count("hkfmData", {
              id: item.id
            });
            if (idCount <= 0) {
              await db
                .insert("hkfmData", item)
                .then(() => {
                  logger.info(`New data added: ${item.id}`);
                })
                .catch((err) => {
                  logger.error(err);
                });
            }
          }
        }
      });
    }
    await db.close();
  } catch (err) {
    logger.error(err);
  }
};

const GetProgram = async (url, category) => {
  try {
    let instance1 = axios.create({
      baseURL: url,
      timeout: 1000000
    });
    const result2 = await instance1.get(url);
    const $ = cheerio.load(result2.data);
    let resultJson = [];
    $("div#page #main #primary #content")
      .find("article")
      .each(async function () {
        const title = $(this).children("header").children("h1").text();
        const audio = $(this).children(".entry-content").children().children();
        const mp3url = audio.attr("src");
        const id = audio.parent().attr("id");
        resultJson.push({
          id,
          title,
          category,
          type: audio.attr("type"),
          src: mp3url,
          downloaded: false,
          downloadDate: null,
          data: null,
          createDatetime: commonUtil.GetDateTime().$d
        });
      });

    return Promise.resolve(resultJson);
  } catch (err) {
    logger.error(err);
    return Promise.reject(err);
  }
};

const DownloadTask = async () => {
  try {
    const db = new DBHelper();
    await db.connect();
    const result = await db.find("hkfmData", { downloaded: false }, null, 10, {
      createDatetime: -1
    });
    await db.close();
    console.log(result);
    //DownloadFile()
    await db.connect();
    for (let item of result) {
      const dest = path.join(downloadPath, `${item.title}.mp3`);
      await DownloadFile(item.src, dest)
        .then(async (result) => {
          await db.update(
            "hkfmData",
            { id: item.id },
            { downloaded: true, path: result }
          );
        })
        .catch((err) => {
          logger.error(err);
        });
    }
    await db.close();
    return Promise.resolve(result);
  } catch (err) {
    logger.error(err);
    return Promise.reject(err);
  }
};

module.exports = { GetHomePage, GetProgram, GetCategory, DownloadTask };
