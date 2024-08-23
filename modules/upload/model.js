// /modules/upload/upload.js

import { DataTypes } from 'sequelize';
import sequelize from '../../db';

const Upload = sequelize.define('Upload', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  FileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ValidationStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Upload;
