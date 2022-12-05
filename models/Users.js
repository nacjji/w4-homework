"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Users -- Posts : 1:N
      this.hasMany(models.Posts, {
        as: "Posts",
        foreignKey: "userId", // Users 테이블의 userId 가 Posts 테이블에 참조된다.
      });
      this.hasMany(models.Comments, {
        as: "Comments",
        foreignKey: "userId",
      });
      this.hasMany(models.Likes, {
        as: "Likes",
        foreignKey: "likesId",
      });
    }
  }
  Users.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        unique: true,
        type: DataTypes.STRING,
      },
      nickname: {
        unique: true,
        type: DataTypes.STRING,
      },
      password: {
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
      modelName: "Users",
    }
  );
  return Users;
};
