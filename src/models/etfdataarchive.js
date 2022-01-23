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
        },
        weight: {
            type: DataTypes.DECIMAL(16,15),
            allowNull: false
        }
    },
    {
        freezeTableName: true
    });

    return etfdataarchive;

}