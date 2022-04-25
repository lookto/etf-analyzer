const express = require("express");

const { getAllEtfProvider } = require("../controllers/etfProvider");
const { getAllEtfsByProviderId } = require("../controllers/etf");

const etfProviderRouter = express.Router();

etfProviderRouter.get("/", getAllEtfProvider);
etfProviderRouter.get("/:id/etfs", getAllEtfsByProviderId);

module.exports = etfProviderRouter;
