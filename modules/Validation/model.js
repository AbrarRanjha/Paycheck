const { DataTypes } =require ('sequelize');
const {sequelize} =require ('../../db.js');
const SalesData =require ('../SaleData/model.js');

const Validation = sequelize.define('Validation', {
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
  grossFCI: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  FCIRecognition: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  payable: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  percetagePayable: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  timestamps: true,
});
SalesData.hasMany(Validation, { foreignKey: 'saleDataId' });
Validation.belongsTo(SalesData, { foreignKey: 'uploadId' });
module.exports = Validation;