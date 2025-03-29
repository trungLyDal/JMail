const mysql = require('mysql');
const DB_PARAMS = require('./config');

const pool = mysql.createPool(DB_PARAMS);

function initializeDatabase() {
  pool.query(`
    CREATE TABLE IF NOT EXISTS user_info (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      last_login DATETIME
    )
  `);

  pool.query(`
    CREATE TABLE IF NOT EXISTS login (
      user_id INT,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      FOREIGN KEY (user_id) REFERENCES user_info(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id VARCHAR(255) PRIMARY KEY,
      user_id INT,
      expires BIGINT,
      FOREIGN KEY (user_id) REFERENCES user_info(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  pool.query(`
    CREATE TABLE IF NOT EXISTS emails (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT NOT NULL,
      recipient_id INT NOT NULL,
      subject VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES user_info(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (recipient_id) REFERENCES user_info(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
}

initializeDatabase();

module.exports = pool;