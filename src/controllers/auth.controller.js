const authService = require("../services/auth.service");
const passwordUtil = require("../utils/password.util");
const { logger } = require("../utils/logger.util");
const TokenHelper = require("../utils/token.util");
const pwdAttempt = 10;

const Login = async (username, password) => {
  try {
    const loginUser = await authService.GetUserByUsername(username);
    if (Array.isArray(loginUser) && loginUser.length > 0) {
      let user = loginUser[0];
      //check pwd pwdAttempt
      if (user.pwdAttempt >= pwdAttempt) {
        return Promise.reject("pwd_attempt");
      }
      if (
        (await passwordUtil.ComparePassword(password, user.password)) === true
      ) {
        //check password
        if (user.activate != true) {
          return await Promise.reject("user_inactivate");
        } else {
          //gen access token
          const token = new TokenHelper();
          const accessToken = await token.signToken({ userId: user.userId });
          return Promise.resolve({
            username: user.username,
            permission: user.permission,
            accessToken
          });
        }
      } else {
        await authService.PasswordAttempt(user.userId, user.pwdAttempt + 1);
        return await Promise.reject("invalid_login");
      }
    } else {
      return await Promise.reject("invalid_login");
    }
  } catch (err) {
    await logger.error(err);
    return await Promise.reject(err);
  }
};

module.exports = { Login };
