module.exports = (sequelize, DataTypes) => {
    const etfdata = sequelize.define("etfdata", {
        isin: {
            type: DataTypes.STRING(12),
        },
        symbol: {
            type: DataTypes.STRING(12),
        },
        weight: {
            type: DataTypes.DECIMAL(16,15),
            allowNull: false
        }
    },
    {
        freezeTableName: true
    });

    etfdata.associate = function (models) {
        etfdata.belongsTo(models.etf);
        etfdata.belongsTo(models.stock);
    };
    return etfdata;
}