const { promisePool } = require("../config/db");

const getAllByUserId = async (user_id) => {
    const [rows] = await promisePool.query("SELECT * FROM categories WHERE user_id = ?", [user_id]);
    return rows;
};

const findById = async (id, user_id) => {
    const [rows] = await promisePool.query("SELECT * FROM categories WHERE id = ? AND user_id = ?", [id, user_id]);
    return rows[0];
};

const create = async (user_id, categoryName, icon) => {
    const [result] = await promisePool.query("INSERT INTO categories (user_id, name, icon) VALUES (?, ?, ?)", [user_id, categoryName, icon || null]);
    return result;
}

const update = async (id, user_id, categoryName, icon) => {
    const [result] = await promisePool.query("UPDATE categories SET categoryName = ?, icon = ? WHERE id = ? AND user_id = ?", [categoryName, icon || null, id, user_id]);
    return result;
}

const remove = async (id, user_id) => {
    const [result] = await promisePool.query("DELETE FROM categories WHERE id = ? AND user_id = ?", [id, user_id]);
    return result;
}

module.exports = {
    getAllByUserId,
    findById,
    create,
    update,
    remove
}