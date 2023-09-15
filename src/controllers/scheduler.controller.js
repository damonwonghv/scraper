const { Job } = require("../services/cron.service");
const {
  GetCategory,
  GetHomePage,
  GetProgram,
  DownloadTask
} = require("../controllers/modules/hkfm/scraper");

const Test = () => {
  Job("* * * * *", () => {
    console.log("Test");
  });
};

const ScrapCategoryHkfm = () => {
  Job(process.env.SCHEDULE_HKFM_CATEGORY_CRON || "0 0 * * 0", () => {
    GetCategory();
  });
};

const ScrapPageHkfm = () => {
  Job(process.env.SCHEDULE_HKFM_PAGE_CRON || "0 0 * * *", () => {
    DownloadTask();
  });
};

const DownloadHkfm = () => {
  Job(process.env.SCHEDULE_HKFM_DOWNLOAD_CRON || "*/5 * * * *", () => {
    DownloadTask();
  });
};

module.exports = { Test, ScrapCategoryHkfm, ScrapPageHkfm, DownloadHkfm };
