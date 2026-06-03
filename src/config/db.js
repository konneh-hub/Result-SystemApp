const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'DOUBLE',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Mk@15590',
  database: process.env.DB_NAME || 'slughubresult',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  timezone: '+00:00',
});

const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

module.exports = {
  pool,
  query,
};
