const Downloader = require("nodejs-file-downloader");
const mysql = require('mysql');
const config = require('./config/config');
const xslx = require('xlsx');

const db = mysql.createConnection({
    host    : config.db.host,
    user    : config.db.user,
    password: config.db.password
});

db.query(`USE ${config.db.database}`);

db.query('SELECT * FROM etf', function (error, results) {
    if (error) throw error;
    for (let i = 0; i<results.length;i++) {
        getFile(results[i].urldatasheet,results[i].id,'');

    };
  });

db.end();


// async function parseSpreadsheet(file,etfid) {

//     let spreadheet = XLSX.readFile("sheetjs.xlsx");

// }


//Download File from URL to /temp/ and use given filename

async function getFile(url,filename,cb) {

    const dl = new Downloader({
        url:url,
        directory: `${__dirname}/temp`,
        onBeforeSave: (deducedName) => {
            return `${filename}${deducedName.slice(deducedName.lastIndexOf('.'))}`;}
    });
    try {
        await dl.download();
        console.log("Download succesfull");
    } catch (error) {
        console.log("Download failed", error);
      }
    
}
