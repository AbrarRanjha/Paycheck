/* eslint-disable no-undef */
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import http from 'http';
dotenv.config();
import registerAllRoutes from './modules/routes.js';
import { sequelize } from './db.js';
import { bootstrap } from "./utils/bootstrap.js";


var app = express();

sequelize
  .sync({ force: false })
  .then(() => {
    bootstrap();

    console.log('Database connected successfully!');
  })
  .catch(error => {
    console.error('Error syncing database:', error);
    process.exit(1);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', registerAllRoutes);
app.get('/', (req, res) => res.json(`Hello it's working`));
const server = http.createServer(app);

export default server;
