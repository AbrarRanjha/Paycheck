const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');
const advisorDetail = require('./advisorDetail.js');
const Payout = require('./model.js');

const ExpensesDetail = sequelize.define(
    'ExpensesDetail',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },

        margin: {
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
        expensesArray: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        advances: {
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
        month: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

    },
    {
        timestamps: true,
    }
);
Payout.hasMany(ExpensesDetail, { foreignKey: 'PayoutID', onDelete: 'CASCADE', });
ExpensesDetail.belongsTo(Payout, { foreignKey: 'PayoutID' });
module.exports = ExpensesDetail;