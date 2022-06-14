const express = require("express");

const { getAllEtfs } = require("../controllers/etf");

const etfRouter = express.Router();

etfRouter.get("/", getAllEtfs);

module.exports = etfRouter;
