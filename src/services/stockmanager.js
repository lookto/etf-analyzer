const db = require("../models");
const { RateLimiter } = require("limiter");
const axios = require("axios");
const sectorManager = require("./stocksectormanager");

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 1100 });

const stockManager = {
    isISIN: async function (data) {
        try {
            const country = await db["country"].findOne({
                where: {
                    isocode: data.substr(0, 2),
                },
                attributes: ["isocode"],
            });
            if (country !== null) {
                return true;
            }
            return false;
        } catch (err) {
            return err;
        }
    },
    isExisting: async function (isin) {
        try {
            const stock = await db["stock"].findOne({
                where: {
                    isin,
                },
            });
            if (stock !== null) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return err;
        }
    },
    checkAndCreate: async function (isin) {
        try {
            if (!(await this.isExisting(isin))) {
                db["stock"]
                    .create({
                        isin,
                    })
                    .then((res) => {
                        this.updateStock(res.id);
                    });
            }
        } catch (err) {
            return err;
        }
    },
    updateStock: async function (id) {
        let rec = await db["stock"].findOne({
            where: {
                id,
            },
        });
        const remainingRequests = await limiter.removeTokens(1);
        axios({
            method: "get",
            url: `https://finnhub.io/api/v1/stock/profile2?isin=${rec.isin}&token=c7a3vaiad3ia366f4oe0`,
            responseType: "json",
        }).then(async(res) => {
            if (res.data.name !== undefined) {
                console.log(res.data.name, res.data.country);
                const sectorId = await sectorManager.checkAndCreate(res.data.finnhubIndustry)
                db["stock"].update(
                    {
                        name: res.data.name,
                        country: res.data.country,
                        stocksectorid: sectorId
                    },
                    {
                        where: {
                            id,
                        },
                    }
                );
            }
        });
    },
};

module.exports = stockManager;
