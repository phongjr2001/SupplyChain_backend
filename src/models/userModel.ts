import { DataTypes } from "sequelize";
import database from "../config/database";

const User = database.define('user', {
   code: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true,
      }
   },
   imageName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   description: {
      type: DataTypes.STRING,
      allowNull: true,
   },
   addressWallet: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         notEmpty: true
      }
   },
   active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
   },
   otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
         notEmpty: false
      }
   },
   verifyOTP: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
   }
}, {
   freezeTableName: true
});

export default User;
