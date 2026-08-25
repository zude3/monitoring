const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const promisePool = pool.promise();

const checkDatabaseConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('Database connection established successfully.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

module.exports = { pool, promisePool, checkDatabaseConnection };