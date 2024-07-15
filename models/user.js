const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      userID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      discordID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      apiKey: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "User",
    }
  );

  return User;
};
