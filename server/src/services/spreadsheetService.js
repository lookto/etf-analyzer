const xlsx = require("xlsx");

const loadSpreadsheetToJson = (filePath) => {
    if (!filePath) return;

    //const workbook = xlsx.readFile(filePath, { raw: true });
    const workbook = xlsx.readFile(filePath, {});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
    });
    return data;
};

module.exports = { loadSpreadsheetToJson };
