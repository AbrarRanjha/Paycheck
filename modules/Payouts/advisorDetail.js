/* eslint-disable no-undef */
// /modules/payments/refundPayments.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');
const SalesData = require('../SaleData/model.js');

const AdvisorDetail = sequelize.define(
  'AdvisorDetail',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    advisorSplit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    payAways: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    advisorBalance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
   loanRepayment: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    deduction: {
       type: DataTypes.FLOAT,
       allowNull: true,
     },
    expenses: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    advances: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    finalAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    datePaid: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    amountPaid: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    advisorSplit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
SalesData.hasOne(AdvisorDetail, { foreignKey: 'comm' });
CommissionSplit.belongsTo(SalesData, { foreignKey: 'saleDataId' });
module.exports = AdvisorDetail;
