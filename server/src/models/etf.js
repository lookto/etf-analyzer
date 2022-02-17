const etfindex = require("./etfindex");

module.exports = (sequelize, DataTypes) => {
    const etf = sequelize.define(
        "etf",
        {
            name: {
                type: DataTypes.STRING,
                unique: true,
            },
            urlDatasheet: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isin: {
                type: DataTypes.STRING(12),
                allowNull: false,
                unique: true,
            },
            active: {
                type: DataTypes.BOOLEAN,
            }
        },
        {
            freezeTableName: true,
        }
    );

    etf.associate = function (models) {
        etf.belongsTo(models.etfindex);
        etf.belongsTo(models.etfprovider);
        etf.hasMany(models.etfdata)
        etf.hasMany(models.etfdataarchive)
    };

    return etf;
};
