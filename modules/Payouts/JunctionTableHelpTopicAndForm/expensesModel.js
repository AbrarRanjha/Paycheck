
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../db.js');

const expenses = sequelize.define(
    'expenses',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        misC: {
            type: DataTypes.JSON,
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

module.exports = expenses;