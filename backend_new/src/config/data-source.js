require("dotenv").config();
require("reflect-metadata");
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "oracle",
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
  synchronize: true, // set false in production, use migrations
  logging: true,
  entities: ["src/entities/**/*.js"],
  migrations: ["src/migrations/**/*.js"],
});

module.exports = { AppDataSource };
