// /modules/payments/earlyPayments.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');
const Employee = require('../User/model.js');

const EarlyPayments = sequelize.define(
  'EarlyPayments',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    advisorId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    advisorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requestPaymentAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalCommission: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approveDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejectDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
Employee.hasMany(EarlyPayments, { foreignKey: 'managerId' });
EarlyPayments.belongsTo(Employee, { foreignKey: 'managerId' });
module.exports = EarlyPayments;
