const Downloader = require("nodejs-file-downloader");
const xlsx = require("xlsx");
const path = require("path");
const db = require("../models");
const _ = require("lodash");
const fs = require("fs");
const stockManager = require("./stockmanager");
const stock = require("../models/stock");

const dataCrawler = {
    crawlData: async function () {
        const etfs = await db["etf"].findAll();
        for (etf of etfs) {
            console.log("Updating etf", etf.name);
            await crawlSpreadsheet(etf);
            //await crawlWebsite(etf);
        }
    },
};

const crawlSpreadsheet = async (etf) => {
    try {
        const dir = path.join(__dirname, "../temp/");
        const filename = await dlSpreadsheet(etf, dir);
        const filepath = path.join(dir, filename);
        await parseSpreadsheet(etf, filepath);
        deleteSpreadsheet(filepath);
    } catch (error) {
        return error;
    }
};

const dlSpreadsheet = async (etf, dir) => {
    var newfilename;

    //create Download
    const dl = new Downloader({
        url: etf.urlDatasheet,
        directory: dir,
        onBeforeSave: (deducedName) => {
            newfilename = `${etf.isin}${path.extname(deducedName)}`;
            return newfilename;
        },
    });

    try {
        //download Spreadsheet
        await dl.download();
        return newfilename;
    } catch (error) {
        console.log("Download failed", error);
        return error;
    }
};

const parseSpreadsheet = async (etf, filepath) => {
    //load and prepare Spreadsheet
    const wb = xlsx.readFile(filepath, { raw: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const filedata = xlsx.utils.sheet_to_json(ws, {
        header: 1,
        blankrows: false,
    });

    //create new etfdata object
    let data = await parseJsonData(etf, filedata);
    let olddata = await getCurrentData(etf);

    if (!_.isEqual(data, olddata)) {
        //check if old data existing

        if (olddata.length !== 0) {
            await moveDataToArchive(etf.id);
        }
        await db["etfdata"].bulkCreate(data);
    }
};

const deleteSpreadsheet = (filepath) => {
    fs.unlinkSync(filepath);
};

const parseJsonData = async (etf, data) => {
    let returnArray = [];
    let stockData = {
        name: null,
        isin: null,
        symbol: null,
        sector: null,
    };
    let weight;
    let weightsum = 0;

    try {
        const spreadsheetConfig = await getSpreadsheetconfig(etf);
        if (spreadsheetConfig.recalculateweight) {
            for (
                let i = spreadsheetConfig.firstdataline;
                i < data.length;
                i++
            ) {
                weight = parseRawToInt(
                    data[i][spreadsheetConfig.weightcolumn]
                );

                if (weight > 0) {
                    weightsum = weightsum + weight;
                }
            }
        }

        for (let i = spreadsheetConfig.firstdataline; i < data.length; i++) {
            stockData.name = null;
            stockData.isin = null;
            stockData.symbol = null;
            stockData.sector = null;
            weight = null;

            stockData.name = data[i][spreadsheetConfig.namecolumn];

            if (spreadsheetConfig.isincolumn !== null) {
                stockData.isin = data[i][spreadsheetConfig.isincolumn];
            } else if (spreadsheetConfig.symbolcolumn !== null) {
                stockData.symbol = data[i][spreadsheetConfig.symbolcolumn];
            }

            if (spreadsheetConfig.sectorcolumn !== null) {
                stockData.sector = data[i][spreadsheetConfig.sectorcolumn];
            }

            weight = data[i][spreadsheetConfig.weightcolumn];
            if (!isDecimal(weight)) {
                continue;
            }
            if (spreadsheetConfig.recalculateweight) {
                weight = parseRawToInt(weight) / weightsum;
                
            }
            weight = weight.toFixed(15);
            if (!(weight > 0)){
                continue;
            }
            

            let stockId = await stockManager.checkAndCreate(etf, stockData);

            returnArray.push({
                etfId: etf.id,
                isin: stockData.isin,
                symbol: stockData.symbol,
                weight: weight,
                stockId: stockId,
            });
        }
        return returnArray;
    } catch (err) {
        console.log(err);
    }
};

const getCurrentData = async (etf) => {
    const currentdata = await db["etfdata"].findAll({
        where: {
            etfid: etf.id,
        },
    });

    let returnArray = [];
    currentdata.map((rec) => {
        returnArray.push({
            etfId: rec.etfId,
            isin: rec.isin,
            symbol: rec.symbol,
            weight: rec.weight,
            stockId: rec.stockId,
        });
    });

    return returnArray;
};

const moveDataToArchive = async (etfid) => {
    try {
        await db.sequelize.query(
            `INSERT INTO etfdataarchive SELECT * FROM etfdata WHERE etfId=${etfid}`
        );
        return await db["etfdata"].destroy({
            where: {
                etfId: etfid,
            },
        });
    } catch (error) {
        return error;
    }
};

const getSpreadsheetconfig = async (etf) => {
    try {
        const etfprovider = await etf.getEtfprovider();
        const etfspreadsheetconf = await etfprovider.getSpreadsheetconfig();
        return etfspreadsheetconf;
    } catch (err) {
        return err;
    }
};

const isDecimal = (n) => {
    const regex = /[-+]?([0-9]*[.])?[0-9]+([eE][-+]?\d+)?/;
    return regex.test(n);
};

const parseRawToInt = (n) => {
    if (n) {
        return parseInt(n.slice(0, n.indexOf(",")).replaceAll(".", ""));
    }
};

module.exports = dataCrawler;
