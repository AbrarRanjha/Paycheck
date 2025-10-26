/* eslint-disable no-undef */
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");

dotenv.config();

const registerAllRoutes = require("./modules/routes.js");
const { sequelize } = require("./db.js");
const { bootstrap } = require("./utils/bootstrap.js");

const app = express();

(async () => {
  try {
    await sequelize.sync(); // Then sync
    bootstrap();
    console.log("✅ Database synced successfully!");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    process.exit(1);
  }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public/uploads")));
app.use(cors());
app.use("/api", registerAllRoutes);
app.get("/api/", (req, res) => res.json(`Hello it's working`));

const server = http.createServer(app);
module.exports = server;
