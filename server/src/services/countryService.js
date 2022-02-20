const db = require("../models");

const countryService = {
    getCountry: async function (searchTerm) {
        if (!searchTerm) {
            return null;
        }

        const country = await db["country"].findOne({
            where: searchTerm,
        });

        return country || null;
    },
    getId: async function (searchTerm) {
        if (!searchTerm) {
            return null;
        }
        const country = await this.getCountry(searchTerm);

        return country?.id || null;
    },
    isExisting: async function (searchTerm) {
        if (!searchTerm) {
            return null;
        }

        const country = await this.getCountry(searchTerm);

        return country ? true : false;
    },
};

module.exports = countryService;
