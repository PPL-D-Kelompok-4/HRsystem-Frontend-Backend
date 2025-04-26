import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hrsystem-api-db"
});

console.log("MySQL connected.");

export default db;
