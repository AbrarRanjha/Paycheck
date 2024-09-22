/* eslint-disable no-undef */
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const { DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } =
  process.env;

const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  {
    host: DATABASE_HOST,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 20000, // milliseconds
    },
  }
);

module.exports = { sequelize };
console.log(sequelize.models);
