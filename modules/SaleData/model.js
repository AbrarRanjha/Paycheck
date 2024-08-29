import { DataTypes } from 'sequelize';
import {sequelize} from '../../db.js';

const SalesData = sequelize.define('SalesData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  transactionID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  saleAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  planType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  commissionRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  grossCommission: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  service: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  IORef: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  GrossFCI: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  FCIRecognition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  submittedPremium: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payable: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  incomeType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default SalesData;
