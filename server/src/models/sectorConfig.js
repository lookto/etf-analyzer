module.exports = (sequelize, DataTypes) => {
    const sectorConfig = sequelize.define(
        "sectorConfig",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );

    sectorConfig.associate = function (models) {
        sectorConfig.belongsTo(models.sector);
        sectorConfig.belongsTo(models.etfProvider);
    };
    return sectorConfig;
};
