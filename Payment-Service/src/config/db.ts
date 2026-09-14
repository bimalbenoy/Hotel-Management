import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const db = knex({
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
});

export default db;