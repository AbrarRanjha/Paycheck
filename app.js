/* eslint-disable no-undef */
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const http = require('http');
dotenv.config();
const registerAllRoutes = require('./modules/routes.js');
const { sequelize } = require('./db.js');
const { bootstrap } = require('./utils/bootstrap.js');
const path = require('path');
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
app.use('/static', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', registerAllRoutes);
app.get('/api/', (req, res) => res.json(`Hello it's working`));
const server = http.createServer(app);

module.exports = server;