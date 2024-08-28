// /modules/payments/refundPayments.js

import { DataTypes } from 'sequelize';
import sequelize from '../../db';

const RefundPayments = sequelize.define('RefundPayments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  managerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestData: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  approvalStatus: {
    type: DataTypes.STRING,
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
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default RefundPayments;
