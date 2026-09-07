const activitySessionService =
    require("../services/activitySessionService");

const createActivitySessions = async (req, res) => {
    try {
        const user_id =
            req.session.user.id;

        const result =
            await activitySessionService
                .createActivitySessions(user_id);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error(
            "CREATE ACTIVITY SESSION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createActivitySessions
};