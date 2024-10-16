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
    splitPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    splitAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    grossFCI: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    FCIRecognition: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    splitType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    premium: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    splitPartnerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    splitPartnerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    planType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // clientId: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    clientName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
SalesData.hasOne(CommissionSplit, { foreignKey: 'saleDataId', onDelete: 'CASCADE', });
CommissionSplit.belongsTo(SalesData, { foreignKey: 'saleDataId' });
module.exports = CommissionSplit;
