const db = require("./models");
const dataCrawler = require("./services/datacrawler");


db.sequelize.sync().then((req) => {

});


const  main = async() => {

    dataCrawler.crawlData(db['etf']);
}

main();


