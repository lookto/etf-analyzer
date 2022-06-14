const db = require("../models");

const getAllCountries = async (req, res) => {
    try {
        const countries = await db["country"].findAll();
        const mappedCountries = countries.map((country) => ({
            id: country.dataValues.id,
            name: country.dataValues.name,
            region: country.dataValues.region,
            market: country.dataValues.market || null,
        }));
        res.send(mappedCountries);
    } catch (error) {
        return error;
    }
};

module.exports = { getAllCountries };
