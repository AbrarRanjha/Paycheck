const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');
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
      defaultValue: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);
module.exports = Upload;
