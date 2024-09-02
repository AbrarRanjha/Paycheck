// /modules/upload/upload.js

import { DataTypes } from 'sequelize';
import {sequelize} from '../../db.js';
import SalesData from '../SaleData/model.js';

const Upload = sequelize.define('Upload', {
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
}, {
  timestamps: true,
});

export default Upload;
Upload.hasMany(SalesData, { foreignKey: 'uploadId' });
SalesData.belongsTo(Upload, { foreignKey: 'uploadId' });