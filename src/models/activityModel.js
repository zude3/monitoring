const { promisePool } = require("../config/db");

const getAllByUserId = async (userId) => {
    const [rows] = await promisePool.query(
        `SELECT 
            activities.*,
            categories.name AS categoryName
         FROM activities
         JOIN categories
            ON activities.category_id = categories.id
         WHERE activities.user_id = ?
         ORDER BY activity_date DESC, activity_time DESC`,
        [userId]
    );

    return rows;
};

const findById = async (id, userId) => {
    const [rows] = await promisePool.query(
        'SELECT * FROM activities WHERE id = ? AND user_id = ?',
        [id, userId]
    );
    return rows[0];
}

const addActivity = async (user_id, category_id, name, duration, activity_date, activity_time, notes) => {
    try{
        const [result] = await promisePool.query(
            'INSERT INTO activities (user_id, category_id, name, duration, activity_date, activity_time, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, category_id, name, duration, activity_date, activity_time, notes]
        );
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getCategoriesByUserId = async (userId) => {
    const [rows] = await promisePool.query(
        'SELECT * FROM categories WHERE user_id = ?',
        [userId]
    );
    return rows;
}

const getTargetsByUserId = async (userId) => {
    const [rows] = await promisePool.query(
        'SELECT * FROM targets WHERE user_id = ?',
        [userId]
    );
    return rows;
}

const update = async (id, userId, category_id, name, duration, activity_date, activity_time, notes) => {
    try {
        const [result] = await promisePool.query(
            'UPDATE activities SET category_id = ?, name = ?, duration = ?, activity_date = ?, activity_time = ?, notes = ? WHERE id = ? AND user_id = ?',
            [category_id, name, duration, activity_date, activity_time, notes, id, userId]
        );
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const remove = async (id, userId) => {
    try {
        const [result] = await promisePool.query(
            'DELETE FROM activities WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getActivitiesByDateAndCategory = async (
    user_id,
    date,
    category_id
) => {

    const [rows] = await promisePool.query(
        `SELECT
            activities.*,
            categories.name,
            categories.icon

        FROM activities

        JOIN categories
            ON categories.id = activities.category_id

        WHERE activities.user_id = ?
        AND activities.category_id = ?
        AND activities.activity_date = ?

        ORDER BY activities.created_at ASC`,
        [
            user_id,
            category_id,
            date
        ]
    );

    return rows;
};

const getActivitiesByDate = async (
    user_id,
    activity_date
) => {

    const [rows] = await promisePool.query(
        `SELECT
            activities.id,
            activities.activity_date,
            activities.name,
            activities.duration,
            activities.notes,

            categories.id AS category_id,
            categories.name AS category_name,
            categories.icon

        FROM activities

        JOIN categories
            ON categories.id = activities.category_id

        WHERE activities.user_id = ?
        AND activities.activity_date = ?

        ORDER BY activities.created_at ASC`,
        [
            user_id,
            activity_date
        ]
    );

    return rows;
};

module.exports = {
    getAllByUserId,
    findById,
    addActivity,
    update,
    getCategoriesByUserId,
    getTargetsByUserId,
    remove,
    getActivitiesByDateAndCategory,
    getActivitiesByDate
}; 