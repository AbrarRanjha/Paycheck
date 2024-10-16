import advisorDetail from "../advisorDetail";
import Payout from "../model";
import Expenses from "./expensesModel";
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../db.js');

const JunctionTableExpensesAndAdvisor = sequelize.define(
  'JunctionTableExpensesAndAdvisor',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Payout.belongsToMany(Expenses, {
  through: JunctionTableExpensesAndAdvisor,
  foreignKey: 'advisorId'
});

Expenses.belongsToMany(Payout, {
  through: JunctionTableExpensesAndAdvisor,
  foreignKey: 'expenseId'
});

module.exports = {
  JunctionTableExpensesAndAdvisor
};