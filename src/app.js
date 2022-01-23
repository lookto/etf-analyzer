const db = require("./models");
const dataCrawler = require("./services/datacrawler");


await db.sequelize.sync({ alter:true }).then((req) => {

});


const  main = async() => {
    await db.sequelize.sync({alter:true});
    dataCrawler.crawlData();
}

main();


