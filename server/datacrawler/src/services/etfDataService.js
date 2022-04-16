const db = require("../models");

const attachOldDataToDataObject = async (data) => {
    if (!data) return;

    try {
        const oldEtfData = await getEtfData({ etfId: data.etf.id });
        data.oldData = oldEtfData;
    } catch (error) {}
};

const getEtfData = async (searchTerm) => {
    if (!searchTerm) return;

    try {
        const etfData = await db["etfData"].findAll({
            where: searchTerm,
        });

        const mappedEtfData = etfData.map(
            ({ etfId, countryId, sectorId, weight }) => {
                let id = { countryId };
                if (sectorId) {
                    id = { sectorId };
                }
                return {
                    weight,
                    etfId,
                    ...id,
                };
            }
        );
        return mappedEtfData;
    } catch (err) {
        console.log(err);
    }
};

const bulkCreateEtfData = async (recs, moveToArchive = false, { id }) => {
    if (!recs || (moveToArchive && !id)) return;

    try {
        if (moveToArchive) {
            await db.sequelize.query(
                `INSERT INTO etfDataArchive SELECT * FROM etfData WHERE etfId=${id}`
            );
            await db["etfData"].destroy({
                where: {
                    etfId: id,
                },
            });
        }
        db["etfData"].bulkCreate(recs);
    } catch (err) {
        console.log(err);
    }
};

const convertWeightsToDecimal = (data) => {
    if (!data) return;

    const convertedData = data.map((item) => ({
        ...item,
        weight: parseFloat(
            item.weight.replaceAll(".", "").replaceAll(",", ".")
        ),
    }));

    return convertedData;
};

const calculatePercentageWeights = (data) => {
    if (!data) return;

    const totalWeight = calculateTotalWeight(data);

    const recalculatedData = data.map((item) => ({
        ...item,
        weight: item.weight / totalWeight,
    }));

    return recalculatedData;
};

module.exports = {
    attachOldDataToDataObject,
    bulkCreateEtfData,
};
