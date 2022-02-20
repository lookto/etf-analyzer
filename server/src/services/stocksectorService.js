const db = require("../models");

const stocksectorService = {
    getStockSector: async function (searchTerm) {
        if (!searchTerm) {
            return null;
        }

        const stockSector = await db["stocksector"].findOne({
            where: searchTerm,
        });

        return stockSector || null;
    },
    getEtfProviderSectorConfig: async function (searchTerm) {
        if (!searchTerm) {
            return null;
        }

        const etfProviderSectorConfig = await db[
            "etfprovidersectorconfig"
        ].findOne({
            where: searchTerm,
        });

        return etfProviderSectorConfig || null;
    },
    getId: async function (sector, etfProviderId = null) {
        if (!sector) {
            return null;
        }

        if (etfProviderId) {
            const etfProviderSectorConfig =
                await this.getEtfProviderSectorConfig({
                    name: sector,
                    etfproviderId: etfProviderId,
                });
            return etfProviderSectorConfig.stocksectorId || null;
        }

        const stockSector = await this.getStockSector({ name: sector });
        return stockSector.id || null;
    },
};

module.exports = stocksectorService;
