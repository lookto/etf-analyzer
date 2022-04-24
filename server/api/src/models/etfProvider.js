module.exports = (sequelize, DataTypes) => {
    const etfProvider = sequelize.define(
        "etfProvider",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            website: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );
    etfProvider.associate = function (models) {
        etfProvider.hasMany(models.etf);
    };

    return etfProvider;
};
