const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');
const SalesData = require('../SaleData/model.js');

const ErrorLogs = sequelize.define('ErrorLogs', {
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
  errorDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Pending",
  },
  comment: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  errorLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  validationKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});
SalesData.hasMany(ErrorLogs, { foreignKey: 'saleDataId', onDelete: 'CASCADE', });
ErrorLogs.belongsTo(SalesData, { foreignKey: 'saleDataId' });
module.exports = ErrorLogs;