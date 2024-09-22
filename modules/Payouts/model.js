const { DataTypes } =require ('sequelize');
const { sequelize } =require ('../../db.js');

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
    totalPayout: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    loanDeduction: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    expenses: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    clawbackDeduction: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    netPayout: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    forwardBalance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    earlyPaymentRequest: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    payoutDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refundAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Payout;