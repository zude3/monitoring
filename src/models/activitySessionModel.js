const {promisePool} = require("../config/db");

const getActivityLogs = async (user_id) => {
    const [rows] = await promisePool.query(
        `
        SELECT
            id,
            app_name,
            window_title,
            started_at,
            ended_at,
            duration_seconds
        FROM activity_logs
        WHERE user_id = ?
        ORDER BY started_at ASC
        `,
        [user_id]
    );

    return rows;
};

const deleteActivitySessions = async (user_id) => {
    const [result] = await promisePool.query(
        `
        DELETE FROM activity_sessions
        WHERE user_id = ?
        `,
        [user_id]
    );

    return result.affectedRows;
};

const insertActivitySession = async ({
    user_id,
    app_name,
    window_title,
    started_at,
    ended_at,
    duration_seconds
}) => {
    const [result] = await promisePool.query(
        `
        INSERT INTO activity_sessions (
            user_id,
            app_name,
            window_title,
            started_at,
            ended_at,
            duration_seconds
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            user_id,
            app_name,
            window_title,
            started_at,
            ended_at,
            duration_seconds
        ]
    );

    return result.affectedRows;
};

module.exports = {
    getActivityLogs,
    deleteActivitySessions,
    insertActivitySession
};