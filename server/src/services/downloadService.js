const Downloader = require("nodejs-file-downloader");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const { isDecimal, calculateTotalWeight } = require("./helperService");

const DIR_TEMP = path.join(__dirname, "../temp/");

const loadSpreadsheetToDataObject = async (data) => {
    if (!data) return;
    try {
        const dl = await downloadFile(data.etf.urlDatasheet, data.etf.isin);

        const jsonData = parseSpreadsheetToJson(dl);

        //filter headerlines
        filteredJsonData = jsonData.filter((line, index) => {
            return (
                index >= data.spreadsheetConfig.firstDataLine &&
                line[data.spreadsheetConfig.weightColumn]
            );
        });

        //convert weights to decimal if needed
        if (data.spreadsheetConfig.convertWeightToDecimal) {
            for (let line of filteredJsonData) {
                line[data.spreadsheetConfig.weightColumn] = parseFloat(
                    line[data.spreadsheetConfig.weightColumn]
                        .replaceAll(".", "")
                        .replaceAll(",", ".")
                );
            }
        }

        //recalculate percantage weight if needed
        if (data.spreadsheetConfig.recalculateWeight) {
            const totalWeight = calculateTotalWeight(
                filteredJsonData,
                data.spreadsheetConfig.weightColumn
            );
            for (let line of filteredJsonData) {
                line[data.spreadsheetConfig.weightColumn] =
                    line[data.spreadsheetConfig.weightColumn] / totalWeight;
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
                    weight: line[data.spreadsheetConfig.weightColumn],
                    country: line[data.spreadsheetConfig.countryColumn],
                    sector: line[data.spreadsheetConfig.sectorColumn],
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
