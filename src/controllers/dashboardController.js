const models = require("../models/monitoringModel");

const getWeekRange = () => {
    const today = new Date();

    const day = today.getDay();

    const diffToMonday =
        day === 0
            ? -6
            : 1 - day;

    const monday = new Date(today);

    monday.setDate(
        today.getDate() + diffToMonday
    );

    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);

    sunday.setDate(
        monday.getDate() + 6
    );

    const formatDate = (date) => {
        return date
            .toISOString()
            .split("T")[0];
    };

    return {
        startDate: formatDate(monday),
        endDate: formatDate(sunday)
    };
};

const index = async (req, res) => {
    try {
        const user_id = req.session.user.id;
        const today = new Date()
            .toISOString()
            .split("T")[0];
        //daily
        const dailyRows = await models.getDailyMonitoring(
            user_id,
            today
        );

        const dailyMonitoring = dailyRows.map(item => {

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

        //weekly    
        const { startDate, endDate } = getWeekRange();

        const weeklyRows =
            await models.getWeeklyMonitoring(
                user_id,
                startDate,
                endDate
            );
        
        const weeklyMonitoring =
            weeklyRows.map(item => {

                const actualValue =
                    Number(item.actual_value);

                const targetValue =
                    Number(item.target_value);

                let status;

                if (actualValue === 0) {
                    status = "red";

                } else if (
                    actualValue < targetValue
                ) {
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

            console.log("Weekly Monitoring:", weeklyMonitoring);

         res.render(
            "dashboard/index",
            {
                user: req.session.user,
                dailyMonitoring,
                weeklyMonitoring,
                startDate,
                endDate
            }
        );

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