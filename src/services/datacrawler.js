const Downloader = require("nodejs-file-downloader");
const xlsx = require('xlsx');
const path = require('path');

const dataCrawler = {
    crawlData: async function(model) {
        const etfs = await model.findAll();
        for(etf of etfs){
            await crawlSpreadsheet(etf);
            //await crawlWebsite(etf);
        }
    
    }     
}


const crawlSpreadsheet = async(etf) => {
    const dir = path.join(__dirname,"../temp/");   
    const file = await dlSpreadsheet(etf.isin,etf.urldatasheet,dir);
    await parseSpreadsheet(path.join(dir,file));
    
}

const dlSpreadsheet = async(fileName,dlUrl,dir) => {

    var newfilename;

    //create Download
    const dl = new Downloader({
        url:dlUrl,
        directory: dir,
        onBeforeSave: (deducedName) => {
            newfilename = `${fileName}${path.extname(deducedName)}`;
            return newfilename;}
    });

    try {
        //download Spreadsheet
        await dl.download();
        return newfilename;
    } catch (error) {
        console.log("Download failed",error);
        return;
    };            
}

const parseSpreadsheet = async(filepath) => {

    //load and prepare Spreadsheet
    const wb = xlsx.readFile(filepath,{raw: true});
    const ws = wb.Sheets[wb.SheetNames[0]];
    const filedata = xlsx.utils.sheet_to_json(ws,{header:"A",blankrows:false});

    
    console.log(filedata[0].A);
    console.log(filedata.length);
}

module.exports = dataCrawler;