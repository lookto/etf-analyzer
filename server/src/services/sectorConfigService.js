const db = require("../models");

const getSectorConfigByEtf = async ({ etfProviderId }) => {
    if (!etfProviderId) return;

    const sectorConfigs = await getAllSectorConfigs({ etfProviderId });
    let mappedSectorConfig;
    if (sectorConfigs) {
        mappedSectorConfig = sectorConfigs.map(({ sectorId, name }) => ({
            sectorId,
            name,
        }));
    }

    return mappedSectorConfig || null;
};

const getAllSectorConfigs = async (searchTerm) => {
    if (!searchTerm) return;

    try {
        const sectorConfigs = await db["sectorConfig"].findAll({
            where: searchTerm,
        });
        return sectorConfigs;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const mapDataToSectorId = async (sector, sectorconfig) => {
    if (!sector || !sectorconfig) return;

    const rec = sectorconfig.find((obj) => {
        return obj.name === sector;
    });

    return rec?.sectorId || null;
};

module.exports = { getSectorConfigByEtf, mapDataToSectorId };
