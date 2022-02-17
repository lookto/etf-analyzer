const db = require("../models");

const countryManager = {
    getIdByIso: async function (isocode) {
        try {
            const country = await db[
                "country"
            ].findOne({
                where: {
                    isocode,
                },
            });
            return country?.id || NULL;
            
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    getRecByIso: async function (isocode) {
        try {
            const country = await db[
                "country"
            ].findOne({
                where: {
                    isocode,
                },
            });
            return country || null;
            
        } catch (err) {
            console.log(err);
            return null;
        }
    }
};

module.exports = countryManager;