module.exports = (sequelize, DataTypes) => {
    const country = sequelize.define(
        "country",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            translation_de: {
                type: DataTypes.STRING,
            },
            isoCode: {
                type: DataTypes.STRING(2),
                allowNull: false,
                unique: true,
            },
            region: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            market: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: false,
        }
    );

    country.associate = function (models) {
        country.hasMany(models.etfData);
        country.hasMany(models.etfDataArchive);
    };

    return country;
};
