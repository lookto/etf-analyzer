module.exports = (sequelize, DataTypes) => {
    const etfdataarchive = sequelize.define("etfdataarchive", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        etfid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                key: 'id',
                model: 'etf'
              }
        },
        isin: {
            type: DataTypes.STRING(12),
            allowNull: false,
            unique: true
        },
        stocksectorid: {
            type: DataTypes.INTEGER,
        },
        weight: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    },
    {
        freezeTableName: true
    });

    return etfdataarchive;

}