module.exports = (sequelize, DataTypes) => {
    const etfDataArchive = sequelize.define(
        "etfDataArchive",
        {
            weight: {
                type: DataTypes.DECIMAL(11, 10),
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );

    etfDataArchive.associate = function (models) {
        etfDataArchive.belongsTo(models.etf);
        etfDataArchive.belongsTo(models.sector);
        etfDataArchive.belongsTo(models.country);
    };
    return etfDataArchive;
};
