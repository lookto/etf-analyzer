const db = require("../models/");

const getAllSectors = async (req, res) => {
    try {
        const sectors = await db["sector"].findAll();
        const mappedSectors = sectors.map((sector) => ({
            id: sector.dataValues.id,
            name: sector.dataValues.name,
        }));
        res.send(mappedSectors);
    } catch (error) {
        return error;
    }
};

module.exports = { getAllSectors };
