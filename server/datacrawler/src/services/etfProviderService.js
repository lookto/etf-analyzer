const db = require("../models");
const { countEtfs } = require("./etfService");

const getAllEtfProviders = async (inclCountOfEtfs = false) => {
    try {
        let etfProviders = await db["etfProvider"].findAll();
        etfProviders = etfProviders.map(({ id, name }) => ({
            id,
            name,
        }));
        if (inclCountOfEtfs) {
            for (const etfProvider of etfProviders) {
                etfProvider.count = await countEtfs({
                    etfProviderId: etfProvider.id,
                });
            }
        }
        return etfProviders;
    } catch (err) {}
};

module.exports = { getAllEtfProviders };
