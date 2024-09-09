/* eslint-disable no-undef */
// /modules/payments/refundPayments.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');
const SalesData = require('../SaleData/model.js');

const CommissionSplit = sequelize.define(
  'CommissionSplit',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    transactionID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    advisorId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    advisorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    advisorSplitPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    grossValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    advisorSplitAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    introducerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    introducerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    introducerSplitPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    introducerSplitAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
SalesData.hasOne(CommissionSplit, { foreignKey: 'saleDataId' });
CommissionSplit.belongsTo(SalesData, { foreignKey: 'saleDataId' });
module.exports = CommissionSplit;
