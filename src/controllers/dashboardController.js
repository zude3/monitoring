const monitoringModel = require("../models/monitoringModel");
const targetModel = require("../models/targetModel");
const categoryModel = require("../models/categoryModel");

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

const formatLocalDate = (date) => {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const buildCalendar = (
    year,
    month,
    activities,
    targetValue
) => {
    const activityMap = {};

    activities.forEach(activity => {
        const date = formatLocalDate(
            new Date(activity.activity_date)
        );

        activityMap[date] =
            Number(activity.actual_value);
    });

    const daysInMonth = new Date( year, month, 0).getDate();

    const firstDay = new Date( year, month - 1, 1);

    let startDay = firstDay.getDay();

    startDay = startDay === 0
        ? 6
        : startDay - 1;

    const calendarDays = [];

    for (let i = 0; i < startDay; i++) {
        calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date( year, month - 1, day );

        const formattedDate =
            formatLocalDate(date);

        const actualValue =
            activityMap[formattedDate] || 0;

        let status;

        if (actualValue === 0) {
            status = "gray";

        } else if (actualValue < targetValue) {
            status = "yellow";

        } else {
            status = "green";
        }

        const progressPercentage =
            targetValue > 0
                ? (actualValue / targetValue) * 100
                : 0;

        calendarDays.push({
            day,
            date: formattedDate,
            actualValue,
            targetValue,
            status,
            progressPercentage
        });
    }

    return calendarDays;
};

const index = async (req, res) => {
    try {
        const user_id = req.session.user.id;
        const today = new Date()
            .toISOString()
            .split("T")[0];

        const now = new Date();
        const year = Number(req.query.year || now.getFullYear());
        const month = Number(req.query.month || now.getMonth() + 1);

        const categories = await categoryModel.getAllByUserId(user_id);

        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const dailyCategories = []
        for(const category of categories){
            const target =
                await targetModel.findDailyByCategory(
                    user_id,
                    category.id
                );

            if (target) {
                dailyCategories.push({
                    ...category,
                    target_value: Number(
                        target.target_value
                    )
                });
            }
        }

        let category_id = Number(req.query.category_id);

        if (!category_id && dailyCategories.length > 0) {
            category_id =
                dailyCategories[0].id;
        }

        let calendar = [];
        let selectedCategory = null;

        if (category_id) {

            selectedCategory =
                dailyCategories.find(
                    category =>
                        category.id === category_id
                );

            if (selectedCategory) {

                const activities =
                    await monitoringModel
                        .getMonthlyDailyMonitoring(
                            user_id,
                            month,
                            category_id,
                            year
                        );

                calendar = buildCalendar(
                    year,
                    month,
                    activities,
                    selectedCategory.target_value
                );
            }
        }

        const dailyRows = await monitoringModel.getDailyMonitoring(
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

            const progressPercentage = targetValue > 0 ? (actualValue / targetValue) * 100 : 0;

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
            await monitoringModel.getWeeklyMonitoring(
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
                dailyCategories,
                selectedCategory,
                calendar,
                month,
                year,
                dailyMonitoring,
                weeklyMonitoring,
                startDate,
                endDate,
                currentTime
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
    index,
    formatLocalDate,
    buildCalendar,
};