const { logger } = require("../utils/logger.util");
const CommonUtil = require("../utils/common.util");
const { AddUser, CountUserByUsername } = require("../services/user.service");
const { GenPassword } = require("../utils/password.util");

const CheckRootAccount = async () => {
  try {
    const uName = "admin".toLowerCase();
    const defaultPwd =
      process.env.ADMIN_DEFAULT_PWD || "161ebd7d45089b3446ee4e0d86dbcf92";
    const existUser = await CountUserByUsername(uName);
    if (existUser <= 0) {
      return await CreateUser(uName, defaultPwd, defaultPwd, sysRole);
    }
  } catch (err) {
    logger.error(err);
    return Promise.reject(err);
  }
};

const CreateUser = async (username, password, confirmPassword, permission) => {
  try {
    if (
      username &&
      password &&
      confirmPassword &&
      permission &&
      typeof username == "string" &&
      typeof password == "string" &&
      typeof confirmPassword == "string" &&
      typeof permission == "string"
    ) {
      const uName = username.toLowerCase();
      const existUser = await CountUserByUsername(uName);
      if (existUser > 0) {
        return await Promise.reject("username_used");
      } else {
        if (password.trim() == confirmPassword.trim()) {
          const pass = await GenPassword(password);
          const userId = CommonUtil.UUID();

          return await AddUser(
            userId,
            username,
            pass,
            permission,
            false,
            0,
            "",
            CommonUtil.GetDateTime().$d,
            true
          );
        } else {
          return Promise.reject("password_not_match");
        }
      }
    } else {
      return await Promise.reject("invalid_param");
    }
  } catch (err) {
    logger.error(err);
    return Promise.reject(err);
  }
};

module.exports = { CreateUser, CheckRootAccount };
