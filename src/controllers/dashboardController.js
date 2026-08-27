const activityModel = require("../models/monitoringModel");

const index = async (req, res) => {
    try {
        const today = new Date()
            .toISOString()
            .split("T")[0];

        const monitoring = await activityModel.getDailyMonitoring(
            req.session.user.id,
            today
        );

        const dailyMonitoring = monitoring.map(item => {

            const actualValue = Number(item.actual_value);
            const targetValue = Number(item.target_value);

            let status;

            if (actualValue === 0) {
                status = "red";
            } else if (actualValue < targetValue) {
                status = "yellow";
            } else {
                status = "green";
            }

            const progressPercentage =
                (actualValue / targetValue) * 100;

            return {
                ...item,
                actualValue,
                targetValue,
                status,
                progressPercentage
            };
        });

        res.render("dashboard/index", {
            user: req.session.user,
            monitoring: dailyMonitoring
        });

    } catch (error) {
        console.error(error);

        res.status(500).send(
            "Error loading dashboard"
        );
    }
};

module.exports = {
    index
};