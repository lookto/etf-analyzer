const db = require("../models");
const sectorManager = require("./stocksectormanager");
const countryManager = require("./countrymanager");
const yahooFinance = require("yahoo-finance2").default;
const { RateLimiter } = require("limiter");

const yahooLimiter = new RateLimiter({ tokensPerInterval: 1, interval: 2000 });

const stockManager = {
    isISIN: async function (data) {
        try {
            const country = await countryManager.getRecByIso(data.substr(0, 2));
            if (country) {
                return true;
            }
            return false;
        } catch (err) {
            return err;
        }
    },
    isExisting: async function (isin, symbol) {
        let stock;
        //Refactor nötig, um Code zu minimieren
        try {
            if (isin) {
                stock = await db["stock"].findOne({
                    where: {
                        isin,
                    },
                });
                if (stock) {
                    return stock.id;
                }
            }

            if (symbol) {
                stock = await db["stock"].findOne({
                    where: {
                        symbol,
                    },
                });
                if (stock) {
                    return stock.id;
                }
            }
            return false;
        } catch (err) {
            return err;
        }
    },
    checkAndCreate: async function (etf, stockData) {
        if ((await this.isISIN(stockData.isin)) || stockData.symbol) {
            try {
                const stockid = await this.isExisting(
                    stockData.isin,
                    stockData.symbol
                );
                if (!stockid) {
                    const stocksectorId = await sectorManager.getId(
                        stockData.sector,
                        etf.etfproviderId
                    );
                    const stock = await db["stock"].create({
                        name: stockData.name,
                        isin: stockData.isin,
                        symbol: stockData.symbol,
                        stocksectorId,
                    });
                    this.updateStock(stock);
                    return stock.id;
                }
                return stockid;
            } catch (err) {
                console.log(err);
                return null;
            }
        }
    },
    updateStock: async function (stock) {
        let queryname;
        let name;
        let symbol;
        let countryId;
        try {
            if (stock.isin) {
                await yahooLimiter.removeTokens(1);
                
                console.log("Searching for ISIN ", stock.isin)
                const query = await yahooFinance.search(stock.isin, {
                    newsCount: 0,
                });

                countryId = await countryManager.getIdByIso(
                    stock.isin.substr(0, 2)
                );

                symbol = stock.symbol || query.quotes[0]?.symbol || null;
                queryname = query.quotes[0]?.shortname || null;
            } else if (stock.symbol) {
                await yahooLimiter.removeTokens(1);
                console.log("Searching for SYMBOL ", stock.symbol)
                const query = await yahooFinance.query(stock.symbol, {
                    fields: ["region", "shortName"],
                });
                countryId = await countryManager.getIdByIso(query?.region);
                queryname = query?.shortName;
            }

            name = queryname || stock.name;

            if (symbol) {
                db["stock"].update(
                    {
                        name,
                        symbol,
                        countryId,
                    },
                    {
                        where: {
                            id: stock.id,
                        },
                    }
                );
            }
        } catch (err) {
            return err;
        }
    },
};

module.exports = stockManager;
