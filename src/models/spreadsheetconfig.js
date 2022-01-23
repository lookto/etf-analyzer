module.exports = (sequelize, DataTypes) => {
    const spreadsheetconfig = sequelize.define("spreadsheetconfig", {
        etfproviderid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                key: 'id',
                model: 'etfprovider'
              }
        },
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

    return spreadsheetconfig;
}

