module.exports = (sequelize, DataTypes) => {
    const etfdataarchive = sequelize.define("etfdataarchive", {
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

    etfdataarchive.associate = function (models) {
        etfdataarchive.belongsTo(models.etf);
        etfdataarchive.belongsTo(models.stock);
    };
    return etfdataarchive;

}