module.exports = (sequelize, DataTypes) => {
    const spreadsheetConfig = sequelize.define(
        "spreadsheetConfig",
        {
            firstDataLine: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            isinColumn: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            countryColumn: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            countryColumnName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            sectorColumn: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            recalculateWeight: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            convertWeightToDecimal: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            weightColumn: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );

    spreadsheetConfig.associate = function (models) {
        spreadsheetConfig.belongsTo(models.etfProvider);
    };

    return spreadsheetConfig;
};
