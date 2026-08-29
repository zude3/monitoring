const { promisePool } = require("../config/db")

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

const getMonthlyDailyMonitoring = async (user_id, month, category_ids, year) => {
    if(category_ids === 0){
        return [];
    }

    const placeholders = category_ids.map(() => "?").join(",")

    const [rows] = await promisePool.query(
        `SELECT
            activity_date, category_id,
            COALESCE(SUM(duration), 0) AS actual_value
        FROM activities
        WHERE user_id = ?
        AND category_id IN  (${placeholders})
        AND YEAR(activity_date) = ?
        AND MONTH(activity_date) = ?
        GROUP BY activity_date, category_id
        ORDER BY activity_date ASC`,
        [
            user_id,
            ...category_ids,
            year,
            month
        ]
    );

    return rows;
};

module.exports = {
    getDailyMonitoring,
    getWeeklyMonitoring,
    getMonthlyDailyMonitoring,
};