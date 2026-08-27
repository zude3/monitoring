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

module.exports = {
    getDailyMonitoring
};