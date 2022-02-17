const db = require("./models");
const dataCrawler = require("./services/datacrawler");

const main = async () => {
    await db.sequelize.sync();
    console.log("db sync done")
    dataCrawler.crawlData();

};

main();
