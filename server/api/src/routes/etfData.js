const express = require("express");

const { getEtfDataById } = require("../controllers/etfData");

const etfDataRouter = express.Router();

etfDataRouter.get("/:id", getEtfDataById);

module.exports = etfDataRouter;
