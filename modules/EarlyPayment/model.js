// /modules/payments/earlyPayments.js

import { DataTypes } from 'sequelize';
import sequelize from '../../db';
import Employee from '../user/employee';

const EarlyPayments = sequelize.define('EarlyPayments', {
  RequestID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  EmployeeID: {
    type: DataTypes.INTEGER,
    references: {
      model: Employee,
      key: 'EmployeeID',
    },
    allowNull: false,
  },
  ManagerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  RequestData: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ApprovalStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  RequestPaymentAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  Note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default EarlyPayments;
