module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Card",
    {
      cardImg: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      cardText: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
};
