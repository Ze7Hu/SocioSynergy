// Create connection to a MySQL database
const Sequelize = require("sequelize");
require("dotenv").config();
let sequelize;
if (process.env.JAWSDB_URL){ // Check if there is a JAWSDB_URL environment variable, used for Heroku deployments, if true it uses that URL to connect to the database
  sequelize = new Sequelize (process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize (
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3306,
  });
}
module.exports = sequelize;
