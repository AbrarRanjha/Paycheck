/* eslint-disable no-undef */
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DATABASE_HOST,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

export const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 20000 // milliseconds
  }

});


console.log(sequelize.models);
