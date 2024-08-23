// /modules/salesData/salesData.js

import { DataTypes } from 'sequelize';
import sequelize from '../../db';
import Employee from '../user/employee';

const SalesData = sequelize.define('SalesData', {
  TransactionID: {
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
  SaleAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  PlanType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CommissionRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  GrossCommission: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  PaymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Other fields as per your schema...
}, {
  timestamps: true,
});

export default SalesData;
