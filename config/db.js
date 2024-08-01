require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Successfully connected to the database");
  connection.release(); // release the connection back to the pool
});

module.exports = pool.promise();
