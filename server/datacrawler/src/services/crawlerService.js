const _ = require("lodash");
const { getEtf, updateEtf } = require("./etfService");
const {
    attachSpreadsheetConfigToDataObject,
} = require("./spreadsheetConfigService");
const {
    attachSectorConfigToDataObject,
    createSectorConfig,
} = require("./sectorConfigService");
const {
    attachCountryConfigToDataObject,
    createCountryConfig,
} = require("./countryConfigService");
const { loadSpreadsheetToDataObject } = require("./downloadService");
const {
    attachOldDataToDataObject,
    bulkCreateEtfData,
} = require("./etfDataService");

const crawlEtfData = async () => {
    const data = {};
    try {
        //get etf
        data.etf = await getEtf({ update: true, failed: false });
        if (!data.etf) return;

        console.log(`${data.etf.id}/${data.etf.isin}: Updating.`);
        updateEtf({ update: false }, { id: data.etf.id });

        //load data from the db
        await attachSpreadsheetConfigToDataObject(data);
        await attachSectorConfigToDataObject(data);
        await attachCountryConfigToDataObject(data);
        await attachOldDataToDataObject(data);

        //dl spreadsheet and load that data
        await loadSpreadsheetToDataObject(data);

        //map and cumulate the new etf data
        await mapRawData(data);
        cumulateMappedData(data);

        //if data has changed, create new data and move old to the archive
        if (!_.isEqual(data.cumulatedData, data.oldData)) {
            await bulkCreateEtfData(data.cumulatedData, true, data.etf);
            console.log(
                `${data.etf.id}/${data.etf.isin}: Data is new and has been written to the db.`
            );
            return true;
        }

        console.log(`${data.etf.id}/${data.etf.isin}: Data didn't change.`);
    } catch (err) {
        console.log(err);
        if (data.etf) {
            updateEtf({ failed: true }, { id: data.etf.id });
        }
    }
};

const mapRawData = async (data) => {
    if (!data) return;

    const missingConfigs = { countries: [], sectors: [] };
    data.mappedData = [];

    //map each element of data.rawData to an object with keys 'weight','countryId' and 'sectorId'
    for (const rawObj of data.rawData) {
        let mappedObj = {};

        mappedObj.weight = rawObj.weight;
        mappedObj.countryId = mapInputWithConfig(
            rawObj.country,
            data.countryConfig,
            "country",
            "countryId",
            missingConfigs.countries
        );
        mappedObj.sectorId =
            data.etf.sectorId ||
            mapInputWithConfig(
                rawObj.sector,
                data.sectorConfig,
                "sector",
                "sectorId",
                missingConfigs.sectors
            );
        data.mappedData.push(mappedObj);
    }

    //if configs are missing, create them without association and throw err
    if (
        missingConfigs.sectors.length > 0 ||
        missingConfigs.countries.length > 0
    ) {
        for (const country of missingConfigs.countries) {
            await createCountryConfig({
                name: `${country} (${data.etf.isin})`,
                etfProviderId: data.etf.etfProviderId,
            });
        }
        for (const sector of missingConfigs.sectors) {
            await createSectorConfig({
                name: `${sector} (${data.etf.isin})`,
                etfProviderId: data.etf.etfProviderId,
            });
        }
        throw `${data.etf.id}/${data.etf.isin}: Configs incomplete. Update failed.`;
    }
};

const mapInputWithConfig = (
    input,
    config,
    searchKey,
    mapKey,
    missingConfigs = []
) => {
    if (!input || !config || !searchKey || !mapKey) return;

    //map input to config using the search- and mapKey, adding the input to missingConfig[] if config for input not found
    const configObj = config.find((element) => {
        return element[searchKey] === input.trim();
    });
    if (!configObj) {
        if (
            input.length > 1 &&
            !missingConfigs.find((element) => {
                return element === input.trim();
            })
        ) {
            missingConfigs.push(input.trim());
        }
        return null;
    }
    return configObj[mapKey];
};

const cumulateMappedData = (data) => {
    if (!data) return;

    data.cumulatedData = [];
    cumulateByConfig(data, data.sectorConfig, "sectorId");
    cumulateByConfig(data, data.countryConfig, "countryId");

    cleanUpCumulatedSums(data, ["sectorId", "countryId"]);
};

const cumulateByConfig = (data, config, key) => {
    if (!data || !config || !key) return;

    //filter duplicates in config by key
    const cleanedConfig = config.filter((element) => {
        return (
            config.indexOf(element) ===
            config.findIndex((val) => {
                return val[key] === element[key];
            })
        );
    });

    //cumulate by key and add to the cumulated data array
    for (const configObj of cleanedConfig) {
        const weightSum = data.mappedData.reduce((total, mappedDataObj) => {
            if (mappedDataObj[key] === configObj[key]) {
                return total + mappedDataObj.weight;
            }
            return total;
        }, 0);

        if (weightSum > 0) {
            data.cumulatedData.push({
                weight: weightSum,
                etfId: data.etf.id,
                [key]: configObj[key],
            });
        }
    }
};

const cleanUpCumulatedSums = (data, keys) => {
    if (!data || !keys) return;

    for (const key of keys) {
        const keyData = data.cumulatedData.filter((element) => {
            if (element[key]) return true;
            return false;
        });
        const totalWeight = keyData.reduce((total, element) => {
            return total + element.weight;
        }, 0);

        for (const dataObj of keyData) {
            data.cumulatedData[data.cumulatedData.indexOf(dataObj)].weight = (
                dataObj.weight / totalWeight
            ).toFixed(10);
        }
    }
};

module.exports = { crawlEtfData };
