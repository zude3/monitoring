const activityWatchService = require("../services/activityWatchService");
const activitySyncService = require("../services/activitySyncService");

const getWindowEvents = async (req, res) => {
    try {
        const events =
            await activityWatchcService.getWindowEvents();

        res.json({
            success: true,
            data: events
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to get ActivityWatch events"
        });
    }
};

const syncActivityWatch = async (req, res) => {
    try {
        const user_id = req.session.user.id;
        console.log("SYNC ACTIVITYWATCH FOR USER ID:", user_id);
        const result =
            await activitySyncService.syncActivityWatch(
                user_id
            );

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error(
            "SYNC ACTIVITYWATCH ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getWindowEvents,
    syncActivityWatch
};