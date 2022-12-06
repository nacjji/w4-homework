"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // Posts -- Users : N:1
    static associate(models) {
      this.belongsTo(models.Users, { foreignKey: "userId" });
      this.hasMany(models.Comments, { foreignKey: "postId" });
      this.hasMany(models.Likes, { foreignKey: "postId" });
    }
  }
  Posts.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // Users 테이블에
          key: "userId", // userId column 과 관계를 맺음
        },
        onDelete: "CASCADE",
        allowNull: false,
        unique: true,
      },

      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Posts",
    }
  );
  return Posts;
};
