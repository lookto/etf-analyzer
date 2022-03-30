const Downloader = require("nodejs-file-downloader");
const path = require("path");
const fs = require("fs");

const DIR_TEMP = path.join(__dirname, "../temp/");

const downloadFile = async (url, newFileName, dir = DIR_TEMP) => {
    if (!url || !newFileName) return;

    let fileName;

    const dl = new Downloader({
        url,
        directory: dir,
        onBeforeSave: (deducedName) => {
            fileName = `${newFileName}${path.extname(deducedName)}`;
            return fileName;
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

module.exports = { downloadFile, deleteFile };
