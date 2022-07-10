const Downloader = require("nodejs-file-downloader");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const {
    isDecimal,
    calculateTotalWeight,
    getArrIndByStrg,
} = require("./helperService");

const DIR_TEMP = path.join(__dirname, "../temp/");

const loadSpreadsheetToDataObject = async (data) => {
    if (!data) return;
    try {
        const dl = await downloadFile(data.etf.urlDatasheet, data.etf.isin);

        const jsonData = parseSpreadsheetToJson(dl);

        let weightColumnId = getArrIndByStrg(
            jsonData[data.spreadsheetConfig.firstDataLine - 1],
            data.spreadsheetConfig.weightColumnName
        );

        weightColumnId =
            weightColumnId > -1
                ? weightColumnId
                : data.spreadsheetConfig.weightColumn;

        let countryColumnId = getArrIndByStrg(
            jsonData[data.spreadsheetConfig.firstDataLine - 1],
            data.spreadsheetConfig.countryColumnName
        );

        countryColumnId =
            countryColumnId > -1
                ? countryColumnId
                : data.spreadsheetConfig.countryColumn;

        let sectorColumnId = getArrIndByStrg(
            jsonData[data.spreadsheetConfig.firstDataLine - 1],
            data.spreadsheetConfig.sectorColumnName
        );

        sectorColumnId =
            sectorColumnId > -1
                ? sectorColumnId
                : data.spreadsheetConfig.sectorColumn;

        //filter headerlines
        filteredJsonData = jsonData.filter((line, index) => {
            return (
                line &&
                index >= data.spreadsheetConfig.firstDataLine &&
                line[weightColumnId] &&
                line[sectorColumnId] !== data.spreadsheetConfig.sectorColumnName
            );
        });

        //convert weights to decimal if needed
        if (data.spreadsheetConfig.convertWeightToDecimal) {
            for (let line of filteredJsonData) {
                line[weightColumnId] = parseFloat(
                    line[weightColumnId]
                        .replaceAll(".", "")
                        .replaceAll(",", ".")
                );
            }
        }

        //recalculate percantage weight if needed
        if (data.spreadsheetConfig.recalculateWeight) {
            const totalWeight = calculateTotalWeight(
                filteredJsonData,
                weightColumnId
            );
            for (let line of filteredJsonData) {
                line[weightColumnId] = line[weightColumnId] / totalWeight;
            }
        }

        //filter data where weight is decimal and > 0
        data.rawData = [];
        for (const line of filteredJsonData) {
            if (
                isDecimal(line[data.spreadsheetConfig.weightColumn]) &&
                line[data.spreadsheetConfig.weightColumn] > 0
            ) {
                data.rawData.push({
                    weight: line[weightColumnId],
                    country: line[countryColumnId],
                    sector: line[sectorColumnId],
                });
            }
        }

        deleteFile(dl);
    } catch (error) {
        console.log(error);
    }
};

const downloadFile = async (url, newFileName = "", dir = DIR_TEMP) => {
    if (!url) return;

    let fileName;

    const dl = new Downloader({
        url,
        directory: dir,
        onBeforeSave: (deducedName) => {
            if (newFileName) {
                fileName = `${newFileName}${path.extname(deducedName)}`;
                return fileName;
            }
            return deducedName;
        },
    });

    try {
        await dl.download();
        const filePath = path.join(dir, fileName);
        return filePath;
    } catch (err) {
        console.log(err);
    }
};

const deleteFile = (filepath) => {
    fs.unlink(filepath, (err) => {
        if (err) throw err;
    });
};

const parseSpreadsheetToJson = (filePath) => {
    if (!filePath) return;
    const workbook = xlsx.readFile(filePath, { raw: true });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let jsonData = xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
    });
    return jsonData;
};

module.exports = {
    loadSpreadsheetToDataObject,
    downloadFile,
    deleteFile,
    parseSpreadsheetToJson,
};
