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
    notificationList: {
      type: DataTypes.JSON,
    },
    permissions: {
      type: DataTypes.STRING,
      defaultValue: '{}', // Store as an empty JSON object in string form
      get() {
        const rawValue = this.getDataValue('permissions');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('permissions', JSON.stringify(value));
      },
    },
  },
  {
    timestamps: true,
  }
);
// Hook to set permissions based on role
User.beforeCreate(user => {
  if (user.role === 'manager') {
    user.permissions = JSON.stringify({
      dashboard: true,
      margin: true,
      errorLog: true,
      commissionSplits: true,
      advisorPayout: true,
      advisorReport: true,
      mailBox: true,
      support: true,
      dataUpload: true,
    });
  } else {
    user.permissions = JSON.stringify({});
  }
});

User.hasMany(ManagerNotification, { foreignKey: 'managerId' });
ManagerNotification.belongsTo(User, {
  foreignKey: 'managerId',
});
module.exports = User;
