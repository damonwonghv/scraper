const express = require("express");
const router = express.Router();

const { handleJsonResponse } = require("./handler.route");
const { LoggerMiddleware } = require("../middlewares/logger.middleware");
const apiRoute = require("./api");

router.use("/api/v1", LoggerMiddleware, apiRoute);

router.get("/", LoggerMiddleware, (req, res, next) => {
  handleJsonResponse(res, "");
});

module.exports = router;
