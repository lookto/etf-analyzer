module.exports = (sequelize, DataTypes) => {
    const etf = sequelize.define(
        "etf",
        {
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
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
                allowNull: false,
                defaultValue: false,
            },
            update: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            failed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            freezeTableName: true,
        }
    );

    etf.associate = function (models) {
        etf.belongsTo(models.etfIndex);
        etf.belongsTo(models.etfProvider);
        etf.belongsTo(models.sector);
        etf.hasMany(models.etfData);
        etf.hasMany(models.etfDataArchive);
    };

    return etf;
};
