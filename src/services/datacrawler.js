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
    url: etf.urldatasheet,
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

  try {
    const spreadsheetconfig = await getSpreadsheetconfig(etf.etfproviderid);

    for (let i = spreadsheetconfig.firstdataline; i < data.length; i++) {
      const isin = data[i][spreadsheetconfig.isincolumn];
      let weight = data[i][spreadsheetconfig.weightcolumn];
      if (!isDecimal(weight)) {
        continue;
      }
      weight = weight.toFixed(15);

      if (await stockManager.isISIN(isin)){
          await stockManager.checkAndCreate(isin);
      }

      returnArray.push({
        etfid: etf.id,
        isin: isin,
        weight: weight,
      });
    }

    return returnArray;
  } catch (error) {
    return error;
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
      etfid: rec.etfid,
      isin: rec.isin,
      weight: rec.weight,
    });
  });

  return returnArray;
};

const moveDataToArchive = async (etfid) => {
  try {
    await db.sequelize.query(
      `INSERT INTO etfdataarchive SELECT * FROM etfdata WHERE etfid=${etfid}`
    );
    return await db["etfdata"].destroy({
      where: {
        etfid: etfid,
      },
    });
  } catch (error) {
    return error;
  }
};

const getSpreadsheetconfig = async (etfproviderid) => {
  try {
    const etfprovider = await db["etfprovider"].findOne({
      where: {
        id: etfproviderid,
      },
    });

    return await db["spreadsheetconfig"].findOne({
      where: {
        etfproviderid: etfprovider.id,
      },
    });
  } catch (error) {
    return error;
  }
};

const isDecimal = (n) => {
  const regex = /[-+]?([0-9]*[.])?[0-9]+([eE][-+]?\d+)?/;
  return regex.test(n);
};

module.exports = dataCrawler;
