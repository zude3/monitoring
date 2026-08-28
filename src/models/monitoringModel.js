const {promisePool} = require('../config/db');

const getDailyMonitoring = async (userId, date) => {
    const [rows] = await promisePool.query(
        `SELECT
            categories.id AS category_id,
            categories.name,
            categories.icon,

            targets.target_value,

            COALESCE(SUM(activities.duration), 0) AS actual_value

        FROM categories

        JOIN targets
            ON targets.category_id = categories.id
            AND targets.user_id = categories.user_id

        LEFT JOIN activities
            ON activities.category_id = categories.id
            AND activities.user_id = categories.user_id
            AND activities.activity_date = ?

        WHERE categories.user_id = ?
        AND targets.period = 'daily'

        GROUP BY
            categories.id,
            categories.name,
            categories.icon,
            targets.target_value`,
        [date, userId]
    );

    return rows;
};

const getWeeklyMonitoring = async (
    userId,
    startDate,
    endDate
) => {
    const [rows] = await promisePool.query(
        `SELECT
            categories.id AS category_id,
            categories.name,
            categories.icon,

            targets.target_value,

            COUNT(
                DISTINCT activities.activity_date
            ) AS actual_value

        FROM categories

        JOIN targets
            ON targets.category_id = categories.id
            AND targets.user_id = categories.user_id

        LEFT JOIN activities
            ON activities.category_id = categories.id
            AND activities.user_id = categories.user_id
            AND activities.activity_date BETWEEN ? AND ?

        WHERE categories.user_id = ?
        AND targets.period = 'weekly'

        GROUP BY
            categories.id,
            categories.name,
            categories.icon,
            targets.target_value`,
        [
            startDate,
            endDate,
            userId
        ]
    );

    return rows;
};

module.exports = {
    getDailyMonitoring,
    getWeeklyMonitoring
};