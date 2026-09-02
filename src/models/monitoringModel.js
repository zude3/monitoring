const { promisePool } = require("../config/db")


const getDailyMonitoring = async (
    user_id,
    monitoring_date
) => {

    const [rows] = await promisePool.query(
        `SELECT
            monitoring.category_id,
            categories.name,
            categories.icon,
            monitoring.monitoring_date,
            monitoring.actual_value,
            monitoring.target_value,
            monitoring.progress_percentage,
            monitoring.status

        FROM monitoring

        JOIN categories
            ON categories.id = monitoring.category_id

        WHERE monitoring.user_id = ?
        AND monitoring.monitoring_date = ?

        ORDER BY categories.id ASC`,
        [
            user_id,
            monitoring_date
        ]
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

const getMonthlyMonitoring = async (
    user_id,
    month,
    year
) => {

    const [rows] = await promisePool.query(
        `SELECT
            DATE_FORMAT(
                monitoring.monitoring_date,
                '%Y-%m-%d'
            ) AS monitoring_date,
            monitoring.category_id,

            categories.name AS category_name,
            categories.icon,

            monitoring.actual_value,
            monitoring.target_value,
            monitoring.progress_percentage,
            monitoring.status

        FROM monitoring

        JOIN categories
            ON categories.id =
                monitoring.category_id

        WHERE monitoring.user_id = ?
        AND YEAR(monitoring.monitoring_date) = ?
        AND MONTH(monitoring.monitoring_date) = ?

        ORDER BY
            monitoring.monitoring_date ASC`,
        [
            user_id,
            year,
            month
        ]
    );
    // console.log("QUERY MONTHLY MONITORING:", rows);
    return rows;
};

const create = async (
    user_id,
    category_id,
    monitoring_date,
    actual_value,
    target_value,
    progress_percentage,
    status
) => {

    const [result] = await promisePool.query(
        `INSERT INTO monitoring (
            user_id,
            category_id,
            monitoring_date,
            actual_value,
            target_value,
            progress_percentage,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE
            actual_value = VALUES(actual_value),
            target_value = VALUES(target_value),
            progress_percentage = VALUES(progress_percentage),
            status = VALUES(status)`,
        [
            user_id,
            category_id,
            monitoring_date,
            actual_value,
            target_value,
            progress_percentage,
            status
        ]
    );

    return result;
};

const update = async (
    user_id,
    category_id,
    monitoring_date,
    actual_value,
    target_value,
    progress_percentage,
    status
) => {

    await promisePool.query(
        `UPDATE monitoring
         SET
            actual_value = ?,
            target_value = ?,
            progress_percentage = ?,
            status = ?
         WHERE user_id = ?
         AND category_id = ?
         AND monitoring_date = ?`,
        [
            actual_value,
            target_value,
            progress_percentage,
            status,
            user_id,
            category_id,
            monitoring_date
        ]
    );
};

module.exports = {
    getDailyMonitoring,
    getWeeklyMonitoring,
    getMonthlyDailyMonitoring,
    getMonthlyMonitoring,
    create,
    update
};