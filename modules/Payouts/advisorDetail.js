
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');
const Upload = require('../upload/model.js');

const advisorDetail = sequelize.define(
  'advisorDetail',
  {
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
    grossFCI: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    FCIRecognition: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    advisorSplitAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    advisorSplitPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },


  },
  {
    timestamps: true,
  }
);
Upload.hasMany(advisorDetail, { foreignKey: 'uploadId', onDelete: 'CASCADE', });
advisorDetail.belongsTo(Upload, { foreignKey: 'uploadId' });
module.exports = advisorDetail;