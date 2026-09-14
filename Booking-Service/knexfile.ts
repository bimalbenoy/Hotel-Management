require("dotenv").config();

module.exports = {
  development: {
    client: "mssql",

    connection: {
      server: process.env.DB_SERVER,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      options: {
        trustServerCertificate: true,
        encrypt: false,
      },
    },

    migrations: {
      directory: "./database/migrations",
    },

    seeds: {
      directory: "./database/seeds",
    },
  },
};