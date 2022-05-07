const db = require("../models");

const getAllCountries = async (req, res) => {
    try {
        console.log("Catching countries");
        const countries = await db["country"].findAll();
        const mappedCountries = countries.map((country) => ({
            id: country.dataValues.id,
            name: country.dataValues.name,
        }));
        res.send(mappedCountries);
    } catch (error) {
        return error;
    }
};

module.exports = { getAllCountries };
