module.exports = (sequelize, DataTypes) => {
    const stock = sequelize.define(
        "stock",
        {
            name: {
                type: DataTypes.STRING,
            },
            isin: {
                type: DataTypes.STRING(12),
                unique: true,
            },
            symbol: {
                type: DataTypes.STRING(20),
                unique: true
            },
            needsUpdate: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            
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
