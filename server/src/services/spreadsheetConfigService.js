const db = require("../models");

const getSpreadsheetConfigByEtf = async ({ etfProviderId }) => {
    if (!etfProviderId) return;

    const spreadsheetConfig = await getSpreadsheetConfig({ etfProviderId });

    if (spreadsheetConfig) {
        const mappedspreadsheetConfig = {
            etfProviderId: spreadsheetConfig.etfProviderId,
            firstDataLine: spreadsheetConfig.firstDataLine,
            isinColumn: spreadsheetConfig.isinColumn,
            countryColumn: spreadsheetConfig.countryColumn,
            sectorColumn: spreadsheetConfig.sectorColumn,
            recalculateWeight: spreadsheetConfig.recalculateWeight,
            convertWeightToDecimal: spreadsheetConfig.convertWeightToDecimal,
            weightColumn: spreadsheetConfig.weightColumn,
        };
        return mappedspreadsheetConfig;
    }

    return null;
};

const getSpreadsheetConfig = async (searchTerm) => {
    if (!searchTerm) return;

    try {
        const spreadsheetConfig = await db["spreadsheetConfig"].findOne({
            where: searchTerm,
        });
        return spreadsheetConfig;
    } catch (err) {
        console.log(err);
        return null;
    }
};

module.exports = { getSpreadsheetConfigByEtf };
