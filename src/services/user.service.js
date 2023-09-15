const DbHelper = require("../utils/mongo.util");

const AddUser = async (
  userId,
  username,
  password,
  permission,
  pwdChangeNeed,
  pwdAttempt,
  lastPwd,
  changePwdDatetime,
  activate
) => {
  if (userId && username && password && permission) {
    const json = {
      userId,
      username,
      password,
      permission,
      pwdChangeNeed,
      pwdAttempt,
      lastPwd,
      activate,
      changePwdDatetime
    };
    let db = new DbHelper();
    await db.connect();
    const result = await db.insert("user", json);
    await db.close();
    return result;
  } else {
    return Promise.reject("invalid_param");
  }
};

const CountUserByUsername = async (username) => {
  if (username) {
    let db = new DbHelper();
    await db.connect();
    const result = await db.count("user", { username: username });
    await db.close();
    return result;
  } else {
    return Promise.reject("invalid_param");
  }
};

module.exports = { AddUser, CountUserByUsername };
