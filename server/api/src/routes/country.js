const express = require("express");

const { getAllCountries } = require("../controllers/country");

const countryRouter = express.Router();

countryRouter.get("/", getAllCountries);

module.exports = countryRouter;
