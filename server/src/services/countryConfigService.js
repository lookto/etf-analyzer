const db = require("../models");
const path = require("path");
const { getAllEtfs } = require("./etfService");
const { downloadFile, deleteFile } = require("./downloadService");
const { loadSpreadsheetToJson } = require("./spreadsheetService");
const { getSpreadsheetConfigByEtf } = require("./spreadsheetConfigService");

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

const getCountryId = async (value, etfProviderId) => {
    if (!value || !etfProviderId) return;

    try {
        const rec = await getCountryConfig({
            name: value,
            etfProviderId,
        });

        return rec?.countryId || null;
    } catch (err) {
        console.log(err);
    }
};

const updateConfigs = async (etfProviderId) => {
    if (!etfProviderId) return;

    const dir = path.join(__dirname, "../temp/");

    const etfs = await getAllEtfs({ etfProviderId });
    let countriesInEtfs = [];
    for (const etf of etfs) {
        const filePath = await downloadFile(etf.urlDatasheet, dir, etf.isin);
        const parsedData = loadSpreadsheetToJson(filePath);
        deleteFile(filePath);
        const { firstDataLine, countryColumn } =
            await getSpreadsheetConfigByEtf(etf);
        const filteredData = parsedData.filter((data, index) => {
            return index >= firstDataLine;
        });

        for (const rec of filteredData) {
            if (
                !countriesInEtfs.find((element) => {
                    return element === rec[countryColumn];
                }) &&
                rec[countryColumn].length > 1
            ) {
                countriesInEtfs.push(rec[countryColumn]);
            }
        }
    }
    countriesInEtfs = countriesInEtfs.sort();
    let newRecCount = 0;
    for (const country of countriesInEtfs) {
        const countryConfig = await getCountryConfig({
            etfProviderId,
            name: country,
        });

        if (!countryConfig) {
            await createCountryConfig({ name: country, etfProviderId });
            newRecCount++;
        }
    }
    return newRecCount;
};

const mapDataToCountryId = async (country, { etfProviderId }) => {
    if (!country || !etfProviderId) return;

    try {
        const countryId = await getCountryId(country, etfProviderId);

        return countryId;
    } catch (err) {
        console.log(err);
    }
};

module.exports = { updateConfigs, mapDataToCountryId };
