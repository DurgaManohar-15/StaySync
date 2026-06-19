const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "8328291394",
  database: "stay_sync",
  multipleStatements: true
});

module.exports = pool;
