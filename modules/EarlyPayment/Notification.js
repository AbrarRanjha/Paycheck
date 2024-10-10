const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');

// Define the ManagerNotification schema
const ManagerNotification = sequelize.define(
  'ManagerNotification',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seen:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
 
  },
  {
    timestamps: true,
  }
);

module.exports = ManagerNotification;
