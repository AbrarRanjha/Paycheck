/* eslint-disable no-undef */
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DATABASE_HOST,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_PORT,
} = process.env;

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DATABASE_HOST,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  port: parseInt(DATABASE_PORT || '3306', 10),
});
console.log(sequelize.models);
