const { promisePool } = require("../config/db");

const getAllByUserId = async (user_id) => {
    const [rows] = await promisePool.query(
        `SELECT
            targets.*,
            categories.name,
            categories.icon
        FROM targets
        JOIN categories
            ON targets.category_id = categories.id
        WHERE targets.user_id = ?
        ORDER BY targets.created_at DESC`,
        [user_id]
    );
    return rows;
};

const findTargetById = async (id) => {
    const [rows] = await promisePool.query(
        "SELECT * FROM targets WHERE id = ?", [id]
    );
    return rows[0];
}

const createTarget = async (user_id, category_id, target_value, period, start_date, end_date, target_type) => {
    const [result] = await promisePool.query(
        "INSERT INTO targets (user_id, category_id, target_value, period, start_date, end_date, target_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [user_id, category_id, target_value, period, start_date, end_date, target_type]
    );
    return result;
};

const getCategoryById = async (user_id) => {
    const [rows] = await promisePool.query(
        "SELECT * FROM categories WHERE user_id = ?", [user_id]
    );
    return rows;
}

module.exports = {
    getAllByUserId,
    findTargetById,
    createTarget,
    getCategoryById
};