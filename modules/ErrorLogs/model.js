const { DataTypes } =require ('sequelize');
const {sequelize} =require ('../../db.js');
const SalesData =require ('../SaleData/model.js');

const ErrorLogs = sequelize.define('ErrorLogs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  errrorDescription: {
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
  },
  comment: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  errorLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});
SalesData.hasMany(ErrorLogs, { foreignKey: 'saleDataId' });
ErrorLogs.belongsTo(SalesData, { foreignKey: 'uploadId' });
module.exports = ErrorLogs;