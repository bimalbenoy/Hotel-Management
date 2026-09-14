import sql from "mssql";

const config: sql.config = {
  server: "localhost",
  user: "sa",
  password: "BimalBenoy#1234",
  database: "HotelManagementDB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function test() {
  try {
    await sql.connect(config);
    console.log("Connected!");
  } catch (err) {
    console.error(err);
  } finally {
    await sql.close();
  }
}

test();