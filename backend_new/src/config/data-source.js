require("dotenv").config();
require("reflect-metadata");
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "oracle",
  username: process.env.ORACLE_USER,           // matches your .env
  password: process.env.ORACLE_PASSWORD,       // matches your .env
  connectString: process.env.ORACLE_CONNECT_STRING,  // matches your .env
  synchronize: true, // set false in production, use migrations
  logging: true,
  entities: ["src/entities/**/*.js"],
  migrations: ["src/migrations/**/*.js"],
});

module.exports = { AppDataSource };
