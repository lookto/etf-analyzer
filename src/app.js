const db = require("./models");
const dataCrawler = require("./services/datacrawler");

const main = async () => {
    await db.sequelize.sync();
    dataCrawler.crawlData();
};

main();
