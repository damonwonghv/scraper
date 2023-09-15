const roleController = require("../services/role.service");
const { logger } = require("../utils/logger.util");
const SYSTEM_ADMIN_ROLECODE = sysRole;

const AddRole = async (
  roleCode,
  roleName,
  roleCname,
  permissionCode,
  activate = true
) => {
  try {
    const exist = await roleController.CheckRoleExist(roleCode);
    if (exist <= 0) {
      return await roleController.CreateRole(
        roleCode,
        roleName,
        roleCname,
        permissionCode,
        activate
      );
    } else {
      return await Promise.reject("role_exist");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

const CheckSystemAdmin = async () => {
  try {
    const exist = await roleController.CheckRoleExist(SYSTEM_ADMIN_ROLECODE);
    if (exist <= 0) {
      return await roleController
        .CreateRole(
          SYSTEM_ADMIN_ROLECODE,
          SYSTEM_ADMIN_ROLECODE,
          SYSTEM_ADMIN_ROLECODE,
          SYSTEM_ADMIN_ROLECODE,
          true
        )
        .then(() => {
          logger.info("sysadmin role added");
          return Promise.resolve();
        })
        .catch((err) => {
          logger.error(err);
          return Promise.reject(err);
        });
    } else {
      return await Promise.resolve();
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = { AddRole, CheckSystemAdmin };
