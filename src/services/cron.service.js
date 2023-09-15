const CronJob = require("cron").CronJob;

const Job = (cron, executeFunction) => {
  const TemplateJob = new CronJob(
    cron,
    executeFunction,
    null,
    true,
    "Asia/Hong_Kong"
  );
  return TemplateJob;
};

module.exports = { Job };
