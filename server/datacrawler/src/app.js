const db = require("./models/");
const cron = require("node-cron");

const { crawlEtfData } = require("./services/crawlerService");
const { setUpdateTrigger } = require("./services/etfService");

const init = async () => {
    //Cron job for setting the update trigger on etfs every monday @2am
    cron.schedule("* 2 * * 1", () => {
        setUpdateTrigger();
    });

    //Cron job for crawling etf data every 5s
    cron.schedule("*/5 * * * * *", () => {
        crawlEtfData();
    });
};

init();
