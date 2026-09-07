const activitySessionModel =
    require("../models/activitySessionModel");

const SESSION_GAP_SECONDS = 30;

const createActivitySessions = async (user_id) => {
    const logs =
        await activitySessionModel.getActivityLogs(
            user_id
        );

    if (logs.length === 0) {
        return {
            logs: 0,
            sessions: 0
        };
    }

    // Hapus hasil session sebelumnya
    await activitySessionModel
        .deleteActivitySessions(user_id);

    const sessions = [];

    let currentSession = null;

    for (const log of logs) {

        if (!currentSession) {
            currentSession =
                createSession(log);

            continue;
        }

        const gapSeconds =
            (
                new Date(log.started_at) -
                new Date(currentSession.ended_at)
            ) / 1000;

        const sameActivity =
            log.app_name ===
                currentSession.app_name &&
            log.window_title ===
                currentSession.window_title;

        if (
            sameActivity &&
            gapSeconds <= SESSION_GAP_SECONDS
        ) {
            currentSession.ended_at =
                log.ended_at;

            currentSession.duration_seconds +=
                log.duration_seconds;
        } else {
            sessions.push(currentSession);

            currentSession =
                createSession(log);
        }
    }

    if (currentSession) {
        sessions.push(currentSession);
    }

    let inserted = 0;

    for (const session of sessions) {
        inserted +=
            await activitySessionModel
                .insertActivitySession({
                    user_id,
                    ...session
                });
    }

    return {
        logs: logs.length,
        sessions: inserted
    };
};

const createSession = (log) => {
    return {
        app_name: log.app_name,
        window_title: log.window_title,
        started_at: log.started_at,
        ended_at: log.ended_at,
        duration_seconds:
            log.duration_seconds
    };
};

module.exports = {
    createActivitySessions
};