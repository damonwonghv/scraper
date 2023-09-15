const bcrypt = require("bcrypt");
const saltRounds = 12;

const GenPassword = async (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

const ComparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { GenPassword, ComparePassword };
