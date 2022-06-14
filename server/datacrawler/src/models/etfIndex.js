module.exports = (sequelize, DataTypes) => {
    const etfIndex = sequelize.define(
        "etfIndex",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            freezeTableName: true,
        }
    );
    etfIndex.associate = function (models) {
        etfIndex.hasMany(models.etf);
    };
    return etfIndex;
};
