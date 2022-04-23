import db from "./models";

export const getAllEtfs = async (req, res) => {
    try {
        const etfs = await db["etf"].findAll({
            where: { active: true },
        });
        const mappedEtfs = etfs.map((etf) => ({
            id: etf.dataValues.id,
            name: etf.dataValues.name,
            isin: etf.dataValues.isin,
            providerId: etf.dataValues.etfProviderId,
            indexId: etf.dataValues.etfIndexId,
        }));
        res.send(mappedEtfs);
    } catch (error) {
        return error;
    }
};
