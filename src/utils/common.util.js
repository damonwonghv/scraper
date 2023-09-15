const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

const UUID = () => {
  return uuidv4();
};

const GetDateTime = (format) => {
  if (typeof format == "undefined") {
    return dayjs();
  } else if (typeof format != "undefined") {
    return dayjs().format(format);
  } else {
    return dayjs();
  }
};

module.exports = { UUID, GetDateTime };
