/* eslint-disable no-undef */
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import registerAllRoutes from './modules/routes.js';
import { sequelize } from './db.js';
import cors from 'cors';

const app = express();
  
const { NODE_ENV, PORT } = process.env;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch(error => {
    console.error('Error syncing database:', error);
    process.exit(1);
  });

app.use(cors());
app.use('/api', registerAllRoutes);

const host = NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.get('/', async () => {
  return { message: 'Working' };
});

app.listen({ host: host, port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${PORT}`);
});
