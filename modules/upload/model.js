/* eslint-disable no-undef */
// /modules/upload/upload.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');
const SalesData = require('../SaleData/model.js');

const Upload = sequelize.define(
  'Upload',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    validationStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Upload.hasMany(SalesData, { foreignKey: 'uploadId' });
SalesData.belongsTo(Upload, { foreignKey: 'uploadId' });
module.exports = Upload;
