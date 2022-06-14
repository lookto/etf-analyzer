const db = require("../models/");

const getEtfDataById = async (req, res) => {
    try {
        const returnObj = {
            etfId: req.params.id,
            countryData: null,
            sectorData: null,
        };
        const etfData = await db["etfData"].findAll({
            where: {
                etfId: req.params.id,
            },
        });

        returnObj.sectorData = etfData
            .filter((data) => {
                return data.dataValues.sectorId !== null;
            })
            .map((data) => ({
                sectorId: data.dataValues.sectorId,
                weight: data.dataValues.weight,
            }));

        returnObj.countryData = etfData
            .filter((data) => {
                return data.dataValues.countryId !== null;
            })
            .map((data) => ({
                countryId: data.dataValues.countryId,
                weight: data.dataValues.weight,
            }));

        res.send(returnObj);
    } catch (error) {
        return error;
    }
};

module.exports = { getEtfDataById };
