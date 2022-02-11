const db = require("../models");

const sectorManager = {
    getId: async function (sector, etfproviderId) {
        try {
            const etfprovidersectorconfig = await db[
                "etfprovidersectorconfig"
            ].findOne({
                where: {
                    name: sector,
                    etfproviderId,
                },
            });
            return etfprovidersectorconfig?.stocksectorId || NULL;
            
        } catch (err) {
            console.log(err);
        }
    },
};

module.exports = sectorManager;
