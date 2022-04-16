module.exports = (sequelize, DataTypes) => {
    const countryConfig = sequelize.define(
        "countryConfig",
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

    countryConfig.associate = function (models) {
        countryConfig.belongsTo(models.country);
        countryConfig.belongsTo(models.etfProvider);
    };
    return countryConfig;
};
