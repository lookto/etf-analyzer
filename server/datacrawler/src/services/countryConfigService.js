const db = require("../models");
const path = require("path");
const { getAllEtfs } = require("./etfService");
const {
    downloadFile,
    deleteFile,
    parseSpreadsheetToJson,
} = require("./downloadService");
const { getSpreadsheetConfig } = require("./spreadsheetConfigService");
const { Op } = require("sequelize");

const getCountryConfig = async (searchTerm) => {
    if (!searchTerm) return;

    try {
        const countryConfig = await db["countryConfig"].findOne({
            where: searchTerm,
        });
        return countryConfig || null;
    } catch (err) {
        console.log(err);
        return undefined;
    }
};

const getCountryConfigs = async (searchTerm) => {
    if (!searchTerm) return;

    try {
        const countryConfig = await db["countryConfig"].findAll({
            where: searchTerm,
        });
        return countryConfig || null;
    } catch (err) {}
};

const createCountryConfig = async (rec) => {
    if (!rec) return;

    try {
        await db["countryConfig"].create(rec);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const updateCountryConfigs = async (etfProviderId) => {
    if (!etfProviderId) return;

    try {
        const dir = path.join(__dirname, "../temp/");
        const { firstDataLine, countryColumn } = await getSpreadsheetConfig({
            etfProviderId,
        });
        const etfs = await getAllEtfs({ etfProviderId });
        let countriesInEtfs = [];
        for (const etf of etfs) {
            console.log(`${etf.name}`);
            const dl = await downloadFile(etf.urlDatasheet, etf.isin, dir);
            const jsonData = parseSpreadsheetToJson(dl);
            deleteFile(dl);

            const filteredData = jsonData.filter((data, index) => {
                return index >= firstDataLine;
            });

            for (const rec of filteredData) {
                if (rec.length > 1) {
                    if (
                        !countriesInEtfs.find((element) => {
                            return element.country === rec[countryColumn];
                        }) &&
                        rec[countryColumn].length > 1
                    ) {
                        countriesInEtfs.push({
                            etf: etf.isin,
                            country: rec[countryColumn],
                        });
                    }
                }
            }
        }
        countriesInEtfs = countriesInEtfs.sort((a, b) => {
            if (a.country < b.country) {
                return -1;
            }
            return 1;
        });

        let newRecCount = 0;
        for (const country of countriesInEtfs) {
            const countryConfig = await getCountryConfig({
                etfProviderId,
                name: country.country,
            });

            if (!countryConfig) {
                await createCountryConfig({
                    name: `${country.country} (${country.etf})`,
                    etfProviderId,
                });
                newRecCount++;
            }
        }
        return newRecCount;
    } catch (error) {
        console.log(error);
    }
};

const attachCountryConfigToDataObject = async (data) => {
    if (!data) return;

    try {
        const countryConfigs = await getCountryConfigs({
            etfProviderId: data.etf.etfProviderId,
            countryId: {
                [Op.not]: null,
            },
        });

        if (countryConfigs) {
            data.countryConfig = [];
            for (const config of countryConfigs) {
                data.countryConfig.push({
                    country: config.name.trim(),
                    countryId: config.countryId,
                });
            }
        }
    } catch (err) {}
};

module.exports = {
    updateCountryConfigs,
    attachCountryConfigToDataObject,
    createCountryConfig,
};
