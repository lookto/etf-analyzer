const express = require("express");

const { getAllSectors } = require("../controllers/sector");

const sectorRouter = express.Router();

sectorRouter.get("/", getAllSectors);

module.exports = sectorRouter;
