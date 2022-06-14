const db = require("../models");

const attachSpreadsheetConfigToDataObject = async (data) => {
    if (!data.etf) return;

    try {
        const spreadsheetConfig = await getSpreadsheetConfig({
            etfProviderId: data.etf.etfProviderId,
        });

        if (spreadsheetConfig) {
            data.spreadsheetConfig = {
                firstDataLine: spreadsheetConfig.firstDataLine,
                isinColumn: spreadsheetConfig.isinColumn,
                countryColumn: spreadsheetConfig.countryColumn,
                sectorColumn: spreadsheetConfig.sectorColumn,
                recalculateWeight: spreadsheetConfig.recalculateWeight,
                convertWeightToDecimal:
                    spreadsheetConfig.convertWeightToDecimal,
                weightColumn: spreadsheetConfig.weightColumn,
            };
        }
    } catch (error) {
        console.log(error);
    }
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

module.exports = { attachSpreadsheetConfigToDataObject, getSpreadsheetConfig };
