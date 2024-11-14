const mysql = require('mysql2/promise');  // Usamos mysql2/promise
const dotenv = require('dotenv');
dotenv.config();

// Crea un pool de conexiones con mysql2/promise
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = connection;
