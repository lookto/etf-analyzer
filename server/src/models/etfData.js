module.exports = (sequelize, DataTypes) => {
    const etfData = sequelize.define(
        "etfData",
        {
            weight: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );

    etfData.associate = function (models) {
        etfData.belongsTo(models.etf);
        etfData.belongsTo(models.sector);
        etfData.belongsTo(models.country);
    };
    return etfData;
};
