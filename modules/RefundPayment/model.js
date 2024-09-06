// /modules/payments/refundPayments.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');
const Employee = require('../User/model.js');

const RefundPayments = sequelize.define(
  'RefundPayments',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requestPaymentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalCommission: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.TEXT,
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
Employee.hasMany(RefundPayments, { foreignKey: 'managerId' });
RefundPayments.belongsTo(Employee, { foreignKey: 'managerId' });
module.exports = RefundPayments;
