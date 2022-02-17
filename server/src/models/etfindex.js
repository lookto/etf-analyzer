module.exports = (sequelize, DataTypes) => {
    const etfindex = sequelize.define(
        "etfindex",
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
    etfindex.associate = function (models) {
        etfindex.hasMany(models.etf, { as: "etfs" });
    };
    return etfindex;
};
