const db = require("../models/");

const getAllEtfs = async (req, res) => {
    try {
        const etfs = await db["etf"].findAll({
            where: { active: true },
        });
        res.send(mapData(etfs));
    } catch (error) {
        return error;
    }
};

const getAllEtfsByProviderId = async (req, res) => {
    try {
        const etfs = await db["etf"].findAll({
            where: {
                active: true,
                etfProviderId: req.params.id,
            },
        });
        res.send(mapData(etfs));
    } catch (error) {
        return error;
    }
};

const mapData = (data) => {
    const mappedData = data.map((etf) => ({
        id: etf.dataValues.id,
        name: etf.dataValues.name,
        isin: etf.dataValues.isin,
        providerId: etf.dataValues.etfProviderId,
        indexId: etf.dataValues.etfIndexId,
    }));

    return mappedData;
};

module.exports = { getAllEtfs, getAllEtfsByProviderId };
