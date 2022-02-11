module.exports = (sequelize, DataTypes) => {
    const etfprovider = sequelize.define("etfprovider", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        website: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        freezeTableName: true
    });
    etfprovider.associate = function (models) {
        etfprovider.hasMany(models.etf, { as: "etfs" });
        etfprovider.hasOne(models.spreadsheetconfig);
    };

    return etfprovider;
}