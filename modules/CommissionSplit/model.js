// /modules/payments/refundPayments.js

import { DataTypes } from 'sequelize';
import {sequelize} from '../../db.js';

const CommissionSplit = sequelize.define('CommissionSplit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  employeeSplitPercentage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employeeSplitAmount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  advisorSplitPercentage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  advisorSplitAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  advisorName: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  advisorId: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  introducerName: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  introducerId: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

}, {
  timestamps: true,
});

export default CommissionSplit;
