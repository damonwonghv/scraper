const DbHelper = require("../utils/mongo.util");
const { logger } = require("../utils/logger.util");

const GetUserByUsername = async (username) => {
  try {
    if (username) {
      const uUser = username.toLowerCase();
      const db = new DbHelper();
      await db.connect();
      const user = await db.find("user", { username: uUser });
      await db.close();
      return user;
    } else {
      return Promise.reject("empty_username_password");
    }
  } catch (err) {
    logger.error(err);
    return Promise.reject(err);
  }
};

const PasswordAttempt = async (userId, newCount) => {
  try {
    if (userId) {
      const db = new DbHelper();
      await db.connect();
      await db.update("user", { userId: userId }, { pwdAttempt: newCount });
      await db.close();
      return await Promise.resolve();
    } else {
      return Promise.reject("invalid_params");
    }
  } catch (err) {
    logger.error(err);
    console.log("error");
    return Promise.reject(err);
  }
};

module.exports = { GetUserByUsername, PasswordAttempt };
