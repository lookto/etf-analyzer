module.exports = (sequelize, DataTypes) => {
    const sector = sequelize.define(
        "sector",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            freezeTableName: true,
            timestamps: false,
        }
    );

    sector.associate = function (models) {
        sector.hasMany(models.etfData);
        sector.hasMany(models.etfDataArchive);
        sector.hasMany(models.sectorConfig);
    };

    return sector;
};
