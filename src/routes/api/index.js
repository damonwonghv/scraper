const express = require("express");
const router = express.Router();

const {
  handleJsonResponse,
  handleSendResponse,
  handleErrorResponse
} = require("../handler.route");
const userRouter = require("./user.route");
const AuthController = require("../../controllers/auth.controller");

router.use("/user", userRouter);

router.post("/login", (req, res, next) => {
  AuthController.Login(req.body.username, req.body.password)
    .then((result) => {
      handleJsonResponse(res, result);
    })
    .catch((err) => {
      console.error(err);
      handleErrorResponse(res, err);
    });
});

router.get("/", (req, res, next) => {
  handleJsonResponse(res, "api work");
});

module.exports = router;
