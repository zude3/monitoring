const {promisePool} = require("../config/db");

const findByEmail = async (email) => {
    const [rows] = await promisePool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
}

const createUser = async (username, email, password) => {
    const [result] = await promisePool.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, password]);
    return result;
}

module.exports = { findByEmail, createUser };