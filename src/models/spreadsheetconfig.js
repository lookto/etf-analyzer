module.exports = (sequelize, DataTypes) => {
    const spreadsheetconfig = sequelize.define("spreadsheetconfig", {
        firstdataline: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isincolumn: {
            type: DataTypes.INTEGER,
        },
        namecolumn: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        weightcolumn: {
            type: DataTypes.INTEGER,
            allowNull: false,
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

