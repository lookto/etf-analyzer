const db = require("./models");
const dataCrawler = require("./services/datacrawler");
const stockManager = require("./services/stockmanager");

const main = async () => {
    await db.sequelize.sync();
    console.log("db sync done")
    dataCrawler.crawlData();

    let stockupdater = setInterval(stockManager.updateStocks, 2000);
};

main();
