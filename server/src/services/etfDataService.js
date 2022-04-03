const db = require("../models");
const { getSpreadsheetConfigByEtf } = require("./spreadsheetConfigService");
const {
    getSectorConfigByEtf,
    mapDataToSectorId,
} = require("./sectorConfigService");
const { mapDataToCountryId } = require("./countryConfigService");

const getEtfData = async (searchTerm) => {
    if (!searchTerm) return;

    try {
        const etfData = await db["etfData"].findAll({
            where: searchTerm,
        });

        const mappedEtfData = etfData.map(
            ({ etfId, countryId, sectorId, weight }) => ({
                etfId,
                countryId,
                sectorId,
                weight,
            })
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

const mapData = async (data, etf) => {
    if (!data || !etf) return;

    const spreadsheetConfig = await getSpreadsheetConfigByEtf(etf);
    const sectorConfig = await getSectorConfigByEtf(etf);

    const filteredData = data.filter((data, index) => {
        if (
            index >= spreadsheetConfig.firstDataLine &&
            isDecimal(data[spreadsheetConfig.weightColumn])
        )
            return true;
        return false;
    });

    let mappedData = [];

    for (const data of filteredData) {
        const countryId = await mapDataToCountryId(
            data[spreadsheetConfig.countryColumn],
            etf
        );

        const sectorId =
            etf.sectorId ||
            (await mapDataToSectorId(
                data[spreadsheetConfig.sectorColumn],
                sectorConfig
            ));
        const weight = parseFloat(
            data[spreadsheetConfig.weightColumn].toFixed(15)
        );
        mappedData.push({ countryId, sectorId, weight });
    }

    const cleanedData = cleanUpWeightData(mappedData, spreadsheetConfig);

    return cleanedData;
};

const cleanUpWeightData = (
    data,
    { convertWeightToDecimal, recalculateWeight }
) => {
    if (!data) return;

    let cleanedData = data;

    if (convertWeightToDecimal === true) {
        cleanedData = convertWeightsToDecimal(cleanedData);
    }

    if (recalculateWeight === true) {
        cleanedData = calculatePercentageWeights(cleanedData);
    }

    return cleanedData;
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

const calculateTotalWeight = (data) => {
    if (!data) return;

    const totalWeight = data
        .filter(({ weight }) => {
            weight > 0;
        })
        .reduce((total, { weight }) => {
            total + weight;
        }, 0);

    return parseFloat(totalWeight);
};

const isDecimal = (n) => {
    const regex = /[-+]?([0-9]*[.])?[0-9]+([eE][-+]?\d+)?/;
    return regex.test(n);
};

const cumulateSectorWeights = (data, etfId) => {
    if (!data || !etfId) return;

    let groupedData = groupBy(data, "sectorId");

    groupedData = groupedData.sort((a, b) => {
        if (a.group < b.group) {
            return -1;
        }
        if (a.group > b.group) {
            return 1;
        }
    });

    const cumulatedData = groupedData.map((sector) => {
        const weight = sector.data
            .reduce((total, stock) => {
                return total + stock.weight;
            }, 0)
            .toFixed(15);

        return {
            etfId,
            countryId: null,
            sectorId: sector.group,
            weight,
        };
    });

    return cumulatedData;
};

const cumulateCountryWeights = (data, etfId) => {
    if (!data || !etfId) return;

    let groupedData = groupBy(data, "countryId");
    groupedData = groupedData.filter((element) => {
        if (element.group) return true;
        return false;
    });
    groupedData = groupedData.sort((a, b) => {
        if (a.group < b.group) {
            return -1;
        }
        if (a.group > b.group) {
            return 1;
        }
    });

    const cumulatedData = groupedData.map((country) => {
        const weight = country.data
            .reduce((total, stock) => {
                return total + stock.weight;
            }, 0)
            .toFixed(15);

        return {
            etfId,
            countryId: country.group,
            sectorId: null,
            weight,
        };
    });

    return cumulatedData;
};

const cumulateWeights = (data, { id }) => {
    if (!data || !id) return;

    const cumulatedData = [
        ...cumulateSectorWeights(data, id),
        ...cumulateCountryWeights(data, id),
    ];

    return cumulatedData;
};

const groupBy = (array, key) => {
    if (!array || !key) return;

    const groupedArray = array.reduce((result, currentValue) => {
        const resultIndex = result.findIndex(
            (element) => element.group === currentValue[key]
        );
        if (resultIndex >= 0) {
            result[resultIndex].data.push(currentValue);
            return result;
        }
        result.push({ group: currentValue[key], data: [currentValue] });

        return result;
    }, []);
    return groupedArray;
};

module.exports = { getEtfData, bulkCreateEtfData, mapData, cumulateWeights };
