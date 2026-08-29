const { promisePool } = require("../config/db");

const getAllByUserId = async (user_id) => {
    const [rows] = await promisePool.query(
        `SELECT
            targets.*,
            categories.name as category_name,
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
        `SELECT
            targets.*,
            categories.name as category_name,
            categories.icon
        FROM targets
        JOIN categories
            ON targets.category_id = categories.id
        WHERE targets.id = ?
        `,
        [id]
    );
    return rows[0];
}

const createTarget = async (user_id, category_id, target_value, period) => {
    const [result] = await promisePool.query(
        "INSERT INTO targets (user_id, category_id, target_value, period) VALUES (?, ?, ?, ?)",
        [user_id, category_id, target_value, period]
    );
    return result;
};

const getCategoryById = async (user_id) => {
    const [rows] = await promisePool.query(
        "SELECT * FROM categories WHERE user_id = ?", [user_id]
    );
    return rows;
}

const updateTarget = async (id, user_id, category_id, target_value, period) => {
    const [result] = await promisePool.query(
        "UPDATE targets SET user_id = ?, category_id = ?, target_value = ?, period = ? WHERE id = ?",
        [user_id, category_id, target_value, period, id]
    );
    return result;
};

const deleteTarget = async (id) => {
    const [result] = await promisePool.query(
        "DELETE FROM targets WHERE id = ?", [id]
    );
    return result;
};

const findDailyByCategory = async (user_id, category_id) => {
    const [rows] = await promisePool.query(
        `SELECT *
        FROM targets
        WHERE user_id = ?
        AND category_id = ?
        AND period = 'daily'
        LIMIT 1`,
        [
            user_id,
            category_id
        ]
    );

    return rows[0];
};

module.exports = {
    getAllByUserId,
    findTargetById,
    createTarget,
    updateTarget,
    getCategoryById,
    deleteTarget,
    findDailyByCategory
};