const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');
const advisorDetail = require('./advisorDetail.js');

const Payout = sequelize.define(
  'Payout',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    advisorId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    advisorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
Payout.hasMany(advisorDetail, { foreignKey: 'PayoutID', });
advisorDetail.belongsTo(Payout, { foreignKey: 'PayoutID' });
module.exports = Payout;