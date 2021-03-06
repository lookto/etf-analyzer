const db = require("../models");
const path = require("path");
const { getAllEtfs } = require("./etfService");
const {
    downloadFile,
    deleteFile,
    parseSpreadsheetToJson,
} = require("./downloadService");
const { getSpreadsheetConfig } = require("./spreadsheetConfigService");
const { getArrIndByStrg } = require("./helperService");
const { Op } = require("sequelize");

const attachSectorConfigToDataObject = async (data) => {
    if (!data) return;

    try {
        const sectorConfigs = await getAllSectorConfigs({
            etfProviderId: data.etf.etfProviderId,
            sectorId: {
                [Op.not]: null,
            },
        });
        if (sectorConfigs) {
            data.sectorConfig = [];
            for (const config of sectorConfigs) {
                data.sectorConfig.push({
                    sector: config.name.trim(),
                    sectorId: config.sectorId,
                });
            }
        }
    } catch (error) {}
};

const getAllSectorConfigs = async (searchTerm) => {
    if (!searchTerm) return;
    try {
        const sectorConfigs = await db["sectorConfig"].findAll({
            where: searchTerm,
        });
        return sectorConfigs;
    } catch (err) {}
};

const getSectorConfig = async (searchTerm) => {
    if (!searchTerm) return;

    try {
        const sectorConfigs = await db["sectorConfig"].findOne({
            where: searchTerm,
        });
        return sectorConfigs || null;
    } catch (err) {}
};

const createSectorConfig = async (rec) => {
    if (!rec) return;

    try {
        await db["sectorConfig"].create(rec);
        return true;
    } catch (err) {}
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

    try {
        const dir = path.join(__dirname, "../temp/");
        const { firstDataLine, sectorColumn, sectorColumnName } =
            await getSpreadsheetConfig({
                etfProviderId,
            });

        const etfs = await getAllEtfs({
            etfProviderId,
            sectorId: {
                [Op.is]: null,
            },
        });

        let sectorsInEtfs = [];
        for (const etf of etfs) {
            console.log(`${etf.name}`);
            const dl = await downloadFile(etf.urlDatasheet, etf.isin, dir);
            const jsonData = parseSpreadsheetToJson(dl);
            deleteFile(dl);

            let sectorColumnId = getArrIndByStrg(
                jsonData[firstDataLine - 1],
                sectorColumnName
            );

            sectorColumnId =
                sectorColumnId > -1 ? sectorColumnId : sectorColumn;

            const filteredData = jsonData.filter((data, index) => {
                return data && index >= firstDataLine && data[sectorColumnId];
            });

            for (const rec of filteredData) {
                if (
                    !sectorsInEtfs.find((element) => {
                        return element.sector === rec[sectorColumnId];
                    }) &&
                    rec[sectorColumnId]?.length > 1
                ) {
                    sectorsInEtfs.push({
                        etf: etf.isin,
                        sector: rec[sectorColumnId],
                    });
                }
            }
        }
        sectorsInEtfs = sectorsInEtfs.sort((a, b) => {
            if (a.sector < b.sector) {
                return -1;
            }
            return 1;
        });
        let newRecCount = 0;
        for (const sector of sectorsInEtfs) {
            const sectorConfig = await getSectorConfig({
                etfProviderId,
                name: sector.sector,
            });

            if (!sectorConfig) {
                await createSectorConfig({
                    name: `${sector.sector} (${sector.etf})`,
                    etfProviderId,
                });
                newRecCount++;
            }
        }
        return newRecCount;
    } catch (error) {}
};

module.exports = {
    attachSectorConfigToDataObject,
    createSectorConfig,
    mapDataToSectorId,
    updateSectorConfigs,
};
