const db = require("../models/");

const getAllEtfIndexes = async (req, res) => {
    try {
        const etfIndexes = await db["etfIndex"].findAll();
        const mappedEtfIndexes = etfIndexes.map((index) => ({
            id: index.dataValues.id,
            name: index.dataValues.name,
        }));
        res.send(mappedEtfIndexes);
    } catch (error) {
        return error;
    }
};

module.exports = { getAllEtfIndexes };
