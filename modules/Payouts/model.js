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
    period: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalGrossFCI: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalAdvisorSplit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalDeduction: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    netPayout: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    margin: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    advisorSplit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    payAways: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    advisorBalance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
   loanRepayment: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    deduction: {
       type: DataTypes.FLOAT,
       allowNull: true,
     },
    expenses: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    advances: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    finalAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    datePaid: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    amountPaid: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    advisorSplit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Payout;