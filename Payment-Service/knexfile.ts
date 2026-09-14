import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: Knex.Config = {
  client: "mssql",
  connection: {
    server: process.env.DB_SERVER!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  migrations: {
    directory: "./database/migrations",
    extension: "ts",
    tableName: "payment_knex_migrations"
  },
};

export default config;