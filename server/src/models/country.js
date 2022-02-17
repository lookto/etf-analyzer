module.exports = (sequelize, DataTypes) => {
    const country = sequelize.define(
        "country",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            isocode: {
                type: DataTypes.STRING(2),
                allowNull: false,
                unique: true,
            },
            region: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );

    country.associate = function (models) {
        country.hasMany(models.stock);
    }

    return country;
};
