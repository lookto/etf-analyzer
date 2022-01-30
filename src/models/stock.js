module.exports = (sequelize, DataTypes) => {
    const stock = sequelize.define("stock", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        isin: {
            type: DataTypes.STRING(12),
            unique: true
        },
        stocksectorid: {
            type: DataTypes.INTEGER,
            references: {
                key: 'id',
                model: 'stocksector'
              }
        },
        country: {
            type: DataTypes.STRING(2)
        }
    },
    {
        freezeTableName: true
    });

    return stock;
}