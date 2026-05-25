import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool();

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log(`PostgreSQL connected to host: ${client.connectionParameters.host}`);

    client.release();
  } catch (error) {
    console.error("PostgreSQL connection error:", error.message);
    process.exit(1);
  }
};

export const query = (text, params) => pool.query(text, params);
