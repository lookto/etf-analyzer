const db = require("../models");

const sectorManager = {
    isExisting: async function (sector) {
        try {
            const stocksector = await db["stocksector"].findOne({
                where: {
                    name: sector,
                },
            });
            if (stocksector !== null) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return err;
        }
    },
    checkAndCreate: async function (sector) {
        try {
            if (!(await this.isExisting(sector))) {
                const stocksector = await db["stocksector"].create({
                    name: sector,
                });
                return stocksector.id;
            }
            return await this.getId(sector);
        } catch (err) {
            console.log(err);
        }
    },
    getId: async function (sector) {
        try {
            const stocksector = await db["stocksector"].findOne({
                where: {
                    name: sector,
                },
            });
            if (stocksector !== null) {
                return stocksector.id;
            }
        } catch (err) {
            console.log(err);
        }
    },
};

module.exports = sectorManager;
