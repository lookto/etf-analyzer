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
                allowNull: false,
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
        etf.hasMany(models.etfData);
        etf.hasMany(models.etfDataArchive);
    };

    return etf;
};
