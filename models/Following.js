const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create our Post model
class Following extends Model {}

// set up fields/columns for Following model
Following.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
    user_following: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
  },
  {
    sequelize,
    timestamp: true,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Following;