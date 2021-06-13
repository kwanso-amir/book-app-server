import pg from "pg";
import dotenv from "dotenv";

const Pool = pg.Pool;
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DB_NAME,
});

export default pool;
