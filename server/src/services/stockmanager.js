const db = require("../models");
const sectorsectorService = require("./stocksectorService");
const countryService = require("./countryService");
const etfDataManager = require("./etfdatamanager");
const yahooFinance = require("yahoo-finance2").default;

const stockManager = {
    createStock: async function (rec) {
        if (!rec) {
            return null;
        }

        const stock = await db["stock"].create(rec);

        return stock.id || null;
    },
    updateStock: async function (data, rec) {
        if (!data || !rec) {
            return;
        }
        try {
            await db["stock"].update(data, {
                where: rec,
            });
        } catch (err) {
            return err;
        }
    },
    isISIN: async function (isin) {
        if (!isin) {
            return null;
        }
        const countryIsExisting = await countryService.isExisting({
            isocode: isin.substr(0, 2),
        });

        return countryIsExisting;
    },
    getStock: async function (searchTerm) {
        if (!searchTerm) {
            return null;
        }

        const stock = await db["stock"].findOne({
            where: searchTerm,
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
        if (!(await this.isISIN(stockData.isin)) && !stockData.symbol) {
            return null;
        }

        const stockId =
            (await this.getStockId({ isin: stockData.isin })) ||
            (await this.getStockId({ symbol: stockData.symbol })) ||
            null;

        if (stockId) {
            return stockId;
        }

        const stocksectorId = await sectorsectorService.getId(
            stockData.sector,
            etf.etfproviderId
        );

        stockId = await this.createStock({
            name: stockData.name,
            isin: stockData.isin,
            symbol: stockData.symbol,
            stocksectorId,
        });
        return stockId;
    },
    updateStocks: async function () {
        const stock = await stockManager.getStock({ needsUpdate: true });

        if (!stock) {
            return;
        }
        console.log("Update Stock", stock.name);

        if (stock.symbol) {
            const search = await yahooApiQuote(stock.symbol);

            if (search?.shortName && search?.region) {
                const countryId = await countryService.getId({
                    isocode: search.region,
                });

                try {
                    await stockManager.updateStock(
                        {
                            name: search.shortName,
                            countryId,
                            needsUpdate: false,
                        },
                        { id: stock.id }
                    );
                } catch (err) {
                    console.log(err);
                }
                return;
            }

            await stockManager.updateStock(
                { needsUpdate: false },
                { id: stock.id }
            );
            return;
        }

        if (stock.isin) {
            const countryId = await countryService.getId({
                isocode: stock.isin.substr(0, 2),
            });
            const search = await yahooApiSearch(stock.isin);
            if (!search) {
                await stockManager.updateStock(
                    { needsUpdate: false },
                    { id: stock.id }
                );
                return;
            }
            try {
                await stockManager.updateStock(
                    {
                        name: search.shortName,
                        countryId,
                        symbol: search.symbol,
                        needsUpdate: false,
                    },
                    { id: stock.id }
                );
            } catch (err) {
                console.log(err);
            }
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

const yahooApiSearch = async (searchTerm) => {
    let searchResults = {
        shortName: null,
        symbol: null,
    };

    if (!searchTerm) {
        return null;
    }

    const query = await yahooFinance.search(searchTerm, {
        newsCount: 0,
    });

    if (!query.quotes[0]) {
        return null;
    }

    searchResults.shortName = query.quotes[0]?.shortname || null;
    searchResults.symbol = query.quotes[0]?.symbol || null;

    return searchResults;
};

const yahooApiQuote = async (searchTerm) => {
    console.log("Suche mit YahooApiQuote");
    let searchResults = {
        shortName: null,
        region: null,
    };
    let query;

    if (!searchTerm) {
        return;
    }

    try {
        query = await yahooFinance.quote(searchTerm, {
            fields: ["region", "shortName"],
        });
    } catch (err) {
        console.log(err);
        return;
    }

    if (query?.name === "TypeError") {
        return;
    }

    searchResults.shortName = query?.shortName || null;
    searchResults.region = query?.region || null;

    return searchResults;
};

module.exports = stockManager;
