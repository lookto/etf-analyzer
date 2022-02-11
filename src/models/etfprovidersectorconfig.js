module.exports = (sequelize, DataTypes) => {
    const etfprovidersectorconfig = sequelize.define("etfprovidersectorconfig", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true
    });

    etfprovidersectorconfig.associate = function (models) {
        etfprovidersectorconfig.belongsTo(models.stocksector);
        etfprovidersectorconfig.belongsTo(models.etfprovider);
    };
    return etfprovidersectorconfig;
}

