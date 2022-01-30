const etfindex = require("./etfindex");

module.exports = (sequelize, DataTypes) => {
    const etf = sequelize.define("etf", {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        urldatasheet: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isin: {
            type: DataTypes.STRING(12),
            allowNull: false,
            unique: true
        },
        etfproviderid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                key: 'id',
                model: 'etfprovider'
              }
        }
        
    },
    {
        freezeTableName: true
    });

    etf.associate = function(models) {
        etf.belongsTo(models.etfindex, {foreignKey: 'etfindexid', as: 'etfindex'})
      };

    return etf;
    
}