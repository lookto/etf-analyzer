module.exports = (sequelize, DataTypes) => {
    const stock = sequelize.define(
        "stock",
        {
            name: {
                type: DataTypes.STRING,
            },
            isin: {
                type: DataTypes.STRING(12),
                unique: true
            }
        },
        {
            freezeTableName: true,
        }
    );

    stock.associate = function (models) {
        stock.hasMany(models.etfdata);
        stock.hasMany(models.etfdataarchive);
        stock.belongsTo(models.stocksector);
        stock.belongsTo(models.country);
    };

    return stock;
};
