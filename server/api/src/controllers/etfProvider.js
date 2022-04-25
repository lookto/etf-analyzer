const db = require("../models/");

const getAllEtfProvider = async (req, res) => {
    try {
        const etfProvider = await db["etfProvider"].findAll();
        const mappedEtfProvider = etfProvider.map((provider) => ({
            id: provider.dataValues.id,
            name: provider.dataValues.name,
            website: provider.dataValues.website,
        }));
        res.send(mappedEtfProvider);
    } catch (error) {
        return error;
    }
};

module.exports = { getAllEtfProvider };
