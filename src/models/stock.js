module.exports = (sequelize, DataTypes) => {
    const stock = sequelize.define("stock", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isin: {
            type: DataTypes.STRING(12),
            allowNull: false,
            unique: true
        },
        stocksectorid: {
            type: DataTypes.INTEGER,
            references: {
                key: 'id',
                model: 'stocksector'
              }
        }
    },
    {
        freezeTableName: true
    });

    return stock;
}