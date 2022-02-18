const db = require("../models");
const sectorManager = require("./stocksectormanager");
const countryManager = require("./countrymanager");
const etfDataManager = require("./etfdatamanager");
const yahooFinance = require("yahoo-finance2").default;
const { Op } = require("sequelize");

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
    getStock: async function (searchTerm) {
        if (!searchTerm) {
            return null;
        }

        const stock = await db["stock"].findOne({
            where: {
                [Op.or]: searchTerm,
            },
        });

        return stock || null;
    },
    getStockId: async function (searchTerm) {
        if (!searchTerm) {
            return null;
        }

        const stock = await this.getStock(searchTerm);

        return stock?.id || null;
    },
    isStockExisting: async function (searchTerm) {
        if (!searchTerm) {
            return null;
        }

        const stock = await this.getStock(searchTerm);
        if (stock) {
            return true;
        }
        return false;
    },
    checkAndCreate: async function (etf, stockData) {
        if ((await this.isISIN(stockData.isin)) || stockData.symbol) {
            try {
                const stockid = await this.isExisting(
                    stockData.isin,
                    stockData.symbol
                );
                if (!this.isExisting({})) {
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
                    return stock.id;
                }
                return stockid;
            } catch (err) {
                console.log(err);
                return null;
            }
        } else {
            return null;
        }
    },
    updateStocks: async function () {
        let countryId;
        let queryname;
        let stockname;
        let stock = await db["stock"].findOne({
            where: {
                needsUpdate: true,
            },
        });
        try {
            if (stock) {
                if (stock.isin) {
                    countryId = await countryManager.getIdByIso(
                        stock.isin.substr(0, 2)
                    );
                    console.log("Searching for ISIN ", stock.isin);
                    const query = await yahooFinance.search(stock.isin, {
                        newsCount: 0,
                    });

                    symbol = stock.symbol || query.quotes[0]?.symbol || null;
                    queryname = query.quotes[0]?.shortname || null;
                } else if (stock.symbol) {
                    console.log("Searching for SYMBOL ", stock.symbol);
                    const query = await yahooFinance.query(stock.symbol, {
                        fields: ["region", "shortName"],
                    });
                    countryId = await countryManager.getIdByIso(query?.region);
                    queryname = query?.shortName;
                }
                stockname = queryname || stock.name;
                if (symbol) {
                    try {
                        await db["stock"].update(
                            {
                                name: stockname,
                                symbol,
                                countryId,
                                needsUpdate: false,
                            },
                            {
                                where: {
                                    id: stock.id,
                                },
                            }
                        );
                    } catch (err) {
                        console.log("Rec already existing");
                        await deleteDuplicate(stock, symbol);
                    }
                } else {
                    db["stock"].update(
                        {
                            needsUpdate: false,
                        },
                        {
                            where: {
                                id: stock.id,
                            },
                        }
                    );
                }
            }
        } catch (err) {
            return err;
        }
    },
};
const deleteDuplicate = async (stock, symbol) => {
    //get duplicate rec
    console.log("Delete Duplicate");
    try {
        const duplicateStock = await db["stock"].findOne({
            where: { symbol },
        });
        console.log(duplicateStock.id);

        //update etfdata where duplicate record is used
        await etfDataManager.bulkUpdate(
            { stockId: stock.id },
            { where: { stockId: duplicateStock.id } },
            true
        );

        //delete duplicate
        await db["stock"].destroy({
            where: { symbol },
        });

        //update stock symbol
        await db["stock"].update({ symbol }, { where: { id: stock.id } });
    } catch (err) {
        console.log(err);
    }
};

module.exports = stockManager;
