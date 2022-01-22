module.exports = (sequelize, DataTypes) => {
    const etf = sequelize.define("etf", {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        etfindexid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                key: 'id',
                model: 'etfindex'
              }
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
        
    },
    {
        freezeTableName: true
    });

    return etf;
    
}