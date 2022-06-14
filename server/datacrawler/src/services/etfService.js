const db = require("../models");

const getAllEtfs = async (searchTerm = {}) => {
    const etfs = await db["etf"].findAll({
        where: searchTerm,
    });
    return etfs;
};

const getEtf = async (searchTerm = {}) => {
    try {
        let etf = await db["etf"].findOne({
            where: searchTerm,
        });
        if (etf) {
            return {
                id: etf.dataValues.id,
                name: etf.dataValues.name,
                urlDatasheet: etf.dataValues.urlDatasheet,
                isin: etf.dataValues.isin,
                active: etf.dataValues.active,
                update: etf.dataValues.update,
                failed: etf.dataValues.failed,
                etfIndexId: etf.dataValues.etfIndexId,
                etfProviderId: etf.dataValues.etfProviderId,
                sectorId: etf.dataValues.sectorId,
            };
        }
    } catch (err) {
        return err;
    }
};

const countEtfs = async (searchTerm = {}) => {
    const etfCount = await db["etf"].count({
        where: searchTerm,
    });
    return etfCount;
};

const updateEtf = async (newData, searchTerm) => {
    if (!newData || !searchTerm) return;

    try {
        const recs = await db["etf"].update(newData, {
            where: searchTerm,
        });
        return recs || null;
    } catch (err) {
        return err;
    }
};

const setUpdateTrigger = async () => {
    try {
        const updated = updateEtf(
            { update: true },
            { active: true, failed: false }
        );
        if (!updated) return null;
        return true;
    } catch (err) {
        return err;
    }
};

module.exports = { getAllEtfs, getEtf, countEtfs, updateEtf, setUpdateTrigger };
