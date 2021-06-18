"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_id",
      });
      Comment.belongsTo(models.Book, {
        as: "book",
        foreignKey: "book_id",
      });
      Comment.hasMany(models.Reply, {
        as: "replies",
        foreignKey: "comment_id",
      });
    }
  }
  Comment.init(
    {
      body: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      book_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
