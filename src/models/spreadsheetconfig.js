module.exports = (sequelize, DataTypes) => {
    const spreadsheetconfig = sequelize.define("spreadsheetconfig", {
        firstdataline: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isincolumn: {
            type: DataTypes.INTEGER,
        },
        symbolcolumn: {
            type: DataTypes.INTEGER,
        },
        namecolumn: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        weightcolumn: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sectorcolumn: {
            type: DataTypes.INTEGER,
        },
        recalculateweight: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
        
    },
    {
        freezeTableName: true
    });

    spreadsheetconfig.associate = function (models) {
        spreadsheetconfig.belongsTo(models.etfprovider);
    };

    return spreadsheetconfig;
}

