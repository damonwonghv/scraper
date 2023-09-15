const DbHelper = require("../utils/mongo.util");
const { logger } = require("../utils/logger.util");

const CreateRole = async (
  roleCode,
  roleName,
  roleCname,
  permissionCode,
  activate
) => {
  try {
    if (
      typeof roleCode == "string" &&
      typeof roleName == "string" &&
      typeof roleCname == "string" &&
      typeof permissionCode == "string" &&
      typeof activate == "boolean"
    ) {
      const uRoleCode = roleCode.toLowerCase();
      const db = new DbHelper();
      await db.connect();
      await db.insert("role", {
        roleCode: uRoleCode,
        roleName,
        roleCname,
        permissionCode,
        activate
      });
      await db.close();
    }
  } catch (err) {
    logger.error(err);
    return Promise.reject(err);
  }
};

const CheckRoleExist = async (roleCode) => {
  try {
    if (roleCode && typeof roleCode == "string") {
      const uRoleCode = roleCode.toLowerCase();
      const db = new DbHelper();
      await db.connect();
      const count = await db.count("role", { roleCode: uRoleCode });
      await db.close();
      return count;
    } else {
      return Promise.reject("invalid_params");
    }
  } catch (err) {
    logger.error(err);
    return Promise.reject(err);
  }
};

module.exports = { CreateRole, CheckRoleExist };
