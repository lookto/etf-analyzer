module.exports = (sequelize, DataTypes) => {
    const stocksector = sequelize.define("stocksector", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        freezeTableName: true
    });
    
    return stocksector;
}