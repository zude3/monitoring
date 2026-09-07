const { promisePool } = require("../config/db");

const insertActivityLog = async ({
    user_id,
    source,
    external_id,
    app_name,
    window_title,
    started_at,
    ended_at,
    duration_seconds
}) => {
    const [result] = await promisePool.query(
        `
        INSERT IGNORE INTO activity_logs (
            user_id,
            source,
            external_id,
            app_name,
            window_title,
            started_at,
            ended_at,
            duration_seconds
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            user_id,
            source,
            external_id,
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
    insertActivityLog
};