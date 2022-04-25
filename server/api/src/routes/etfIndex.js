const express = require("express");

const { getAllEtfIndexes } = require("../controllers/etfIndex");

const etfIndexRouter = express.Router();

etfIndexRouter.get("/", getAllEtfIndexes);

module.exports = etfIndexRouter;
