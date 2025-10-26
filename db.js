/* eslint-disable no-undef */
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  dialectOptions: {
    connectTimeout: 20000, // milliseconds
  },
  logging: false,
});

// Retry connection helper
// async function connectWithRetry(retries = 10, delay = 5000) {
//   while (retries > 0) {
//     try {
//       console.log("🟡 Trying to connect to database...");
//       await sequelize.authenticate();
//       console.log("✅ Database connected successfully!");
//       return sequelize;
//     } catch (err) {
//       console.error(
//         `❌ Database connection failed (${err.message}). Retries left: ${retries - 1}`
//       );
//       retries -= 1;
//       if (retries === 0) throw new Error("Could not connect to database.");
//       await new Promise((res) => setTimeout(res, delay));
//     }
//   }
// }

module.exports = { sequelize };
