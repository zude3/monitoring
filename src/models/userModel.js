const {promisePool} = require("../config/db");

const findByEmail = async (email) => {
    const [rows] = await promisePool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
}

const createUser = async (username, email, password) => {
    const [result] = await promisePool.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, password]);
    return result;
}

const getAll = async () => {

    const [rows] =
        await promisePool.query(
            `SELECT id FROM users`
        );

    return rows;
};

module.exports = { findByEmail, createUser, getAll};