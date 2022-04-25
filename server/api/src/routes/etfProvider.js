const express = require("express");

const { getAllEtfProvider } = require("../controllers/etfProvider");

const etfProviderRouter = express.Router();

etfProviderRouter.get("/", getAllEtfProvider);

module.exports = etfProviderRouter;
