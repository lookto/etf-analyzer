const db = require("../models");

const getCountry = async (searchTerm) => {
    if (!searchTerm) return;

    try {
        const country = await db["country"].findOne({
            where: searchTerm,
        });
        return country || null;
    } catch (err) {
        console.log(err);
    }
};

const getId = async (searchTerm) => {
    if (!searchTerm) return;

    try {
        const country = await getCountry(searchTerm);
        return country.id || null;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {};
