const express = require("express");
const router = express.Router();

const {
  handleJsonResponse,
  handleSendResponse,
  handleErrorResponse
} = require("../handler.route");
const userController = require("../../controllers/user.controller");

router.post("/", (req, res, next) => {
  userController
    .CreateUser(
      req.body.username,
      req.body.password,
      req.body.confirmPassword,
      req.body.permission
    )
    .then((result) => {
      handleJsonResponse(res, "added");
    })
    .catch((err) => {
      handleErrorResponse(res, err);
    });
});

module.exports = router;
