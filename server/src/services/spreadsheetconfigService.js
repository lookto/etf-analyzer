const db = require("../models");

const spreadsheetConfigService = {
    getSpreadsheetConfigByEtf: async function (etf) {
        if (!etf) {
            return null;
        }
        const etfProvider = await etf.getEtfprovider();
        const etfSpreadsheetConfig = await etfProvider.getSpreadsheetconfig();

        return (config = {
            firstDataLine: etfSpreadsheetConfig.firstdataline,
            nameColumn: etfSpreadsheetConfig.namecolumn,
            isincColumn: etfSpreadsheetConfig.isincolumn,
            symbolColumn: etfSpreadsheetConfig.symbolcolumn,
            sectorColumn: etfSpreadsheetConfig.sectorcolumn,
            weightColumn: etfSpreadsheetConfig.weightcolumn,
            recalculateWeight: etfSpreadsheetConfig.recalculateweight,
        });
    },
};

module.exports = spreadsheetConfigService;
