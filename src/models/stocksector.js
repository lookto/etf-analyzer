module.exports = (sequelize, DataTypes) => {
    const stocksector = sequelize.define(
        "stocksector",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            freezeTableName: true,
        }
    );

    stocksector.associate = function (models) {
        stocksector.hasMany(models.stock);
        stocksector.hasMany(models.etfprovidersectorconfig);
    };

    return stocksector;
};
