/* eslint-disable no-undef */
// /modules/user/employee.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js'); // Assuming db.js exports an initialized Sequelize instance
const ManagerNotification = require('../EarlyPayment/Notification.js');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'manager',
    },
    resetToken: {
      type: DataTypes.STRING,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // dashboard: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
    // margin: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
    // errorLog: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
    // commissionSplits: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
    // advisorPayout: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
    // advisorReport: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
    // mailBox: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
    // support: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
    // dataUpload: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
    // notificationList: {
    //   type: DataTypes.JSON,
    // },
  },
  {
    timestamps: true,
  }
);

User.hasMany(ManagerNotification, { foreignKey: 'managerId' });
ManagerNotification.belongsTo(User, {
  foreignKey: 'managerId',
});
module.exports = User;
