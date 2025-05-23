import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWOR,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
});

console.log("MySQL connected.");

export default db;
