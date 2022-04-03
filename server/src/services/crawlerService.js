const _ = require("lodash");
const { getEtf, updateEtf } = require("./etfService");
const { downloadFile, deleteFile } = require("./downloadService");
const { loadSpreadsheetToJson } = require("./spreadsheetService");
const {
    mapData,
    cumulateWeights,
    getEtfData,
    bulkCreateEtfData,
} = require("./etfDataService");

const crawlEtfData = async () => {
    try {
    console.log("Checking for etf data to update");
    const etf = await getEtf({ update: true, failed: false });

    if (!etf) return;

    console.log("Updating etf", etf.name);

    const dl = await downloadFile(etf.urlDatasheet, etf.isin);
    const data = loadSpreadsheetToJson(dl);
    deleteFile(dl);
    const rawEtfData = await mapData(data, etf);
    const cumulatedData = cumulateWeights(rawEtfData, etf);

    const oldData = await getEtfData({ etfId: etf.id });
    //check if data changed
    if (!_.isEqual(cumulatedData, oldData)) {
        await bulkCreateEtfData(cumulatedData, true, etf);
    }

    updateEtf({ update: false }, { id: etf.id });
    } catch (err) {
    }
};

module.exports = { crawlEtfData };
