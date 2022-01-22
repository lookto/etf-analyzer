module.exports = (sequelize, DataTypes) => {
    const etfprovider = sequelize.define("etfprovider", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        website: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        freezeTableName: true
    });

    return etfprovider;
}