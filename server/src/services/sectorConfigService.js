const db = require("../models");

const path = require("path");
const { getAllEtfs } = require("./etfService");
const { downloadFile, deleteFile } = require("./downloadService");
const { loadSpreadsheetToJson } = require("./spreadsheetService");
const { getSpreadsheetConfigByEtf } = require("./spreadsheetConfigService");

const getSectorConfigByEtf = async ({ etfProviderId }) => {
    if (!etfProviderId) return;

    const sectorConfigs = await getAllSectorConfigs({ etfProviderId });
    if (sectorConfigs) {
        const mappedSectorConfig = sectorConfigs.map(({ sectorId, name }) => ({
            sectorId,
            name,
            etfProviderId,
        }));
        return mappedSectorConfig;
    }
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

const getSectorConfig = async (searchTerm) => {
    if (!searchTerm) return;

    try {
        const sectorConfigs = await db["sectorConfig"].findOne({
            where: searchTerm,
        });
        return sectorConfigs;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const createSectorConfig = async (rec) => {
    if (!rec) return;

    try {
        await db["sectorConfig"].create(rec);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const mapDataToSectorId = async (sector, sectorconfig) => {
    if (!sector || !sectorconfig) return;

    const rec = sectorconfig.find((obj) => {
        return obj.name === sector;
    });

    return rec?.sectorId || null;
};

const updateSectorConfigs = async (etfProviderId) => {
    if (!etfProviderId) return;

    const dir = path.join(__dirname, "../temp/");
    const { firstDataLine, sectorColumn, isinColumn } =
        await getSpreadsheetConfigByEtf({
            etfProviderId,
        });

    const etfs = await getAllEtfs({ etfProviderId, sectorId: null });

    let sectorsInEtfs = [];
    for (const etf of etfs) {
        const filePath = await downloadFile(etf.urlDatasheet, etf.isin, dir);

        const parsedData = loadSpreadsheetToJson(filePath);
        deleteFile(filePath);

        const filteredData = parsedData.filter((data, index) => {
            return index >= firstDataLine;
        });

        for (const rec of filteredData) {
            if (
                !sectorsInEtfs.find((element) => {
                    return element.sector === rec[sectorColumn];
                }) &&
                rec[sectorColumn].length > 1
            ) {
                sectorsInEtfs.push({
                    etf: etf.isin,
                    sector: rec[sectorColumn],
                });
            }
        }
    }
    sectorsInEtfs = sectorsInEtfs.sort((a, b) => {
        if (a.sector < b.sector) {
            return -1;
        }
        if (a.sector > b.sector) {
            return 1;
        }
    });
    let newSectors = [];
    let newRecCount = 0;
    for (const sector of sectorsInEtfs) {
        const sectorConfig = await getSectorConfig({
            etfProviderId,
            name: sector.sector,
        });

        if (!sectorConfig) {
            newSectors.push(sector);
            await createSectorConfig({ name: sector.sector, etfProviderId });
            newRecCount++;
        }
    }
    newSectors = newSectors.sort((a, b) => {
        if (a.etf < b.etf) {
            return -1;
        }
        if (a.etf > b.etf) {
            return 1;
        }
    });
    newSectors.forEach((element) => {
        console.log(element);
    });
    return newRecCount;
};

module.exports = {
    getSectorConfigByEtf,
    mapDataToSectorId,
    updateSectorConfigs,
};
