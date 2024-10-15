const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const EmployeeReports = sequelize.define('EmployeeReports', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  totalGrossFci: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  totalFciRecognition: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  adviserFeesCommission: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  adviserAdjustments: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  totalDueToAdviser: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  statementPaymentToBeCreated: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  team: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default EmployeeReports;
