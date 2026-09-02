const monitoringModel = require("../models/monitoringModel");
const targetModel = require("../models/targetModel");
const categoryModel = require("../models/categoryModel");

// const getWeekRange = () => {
//     const today = new Date();

//     const day = today.getDay();

//     const diffToMonday =
//         day === 0
//             ? -6
//             : 1 - day;

//     const monday = new Date(today);

//     monday.setDate(
//         today.getDate() + diffToMonday
//     );

//     monday.setHours(0, 0, 0, 0);

//     const sunday = new Date(monday);

//     sunday.setDate(
//         monday.getDate() + 6
//     );

//     const formatDate = (date) => {
//         return date
//             .toISOString()
//             .split("T")[0];
//     };

//     return {
//         startDate: formatDate(monday),
//         endDate: formatDate(sunday)
//     };
// };

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
    monitoring
) => {

    // console.log("=== BUILD CALENDAR ===");
    // console.log("YEAR:", year);
    // console.log("MONTH:", month);
    // console.log("MONITORING:", monitoring);

    const monitoring_map = {};

    monitoring.forEach(item => {
        const date = item.monitoring_date;

        if (!monitoring_map[date]) {
            monitoring_map[date] = [];
        }

        monitoring_map[date].push({
            category_id: item.category_id,
            category_name: item.category_name,
            icon: item.icon,

            actual_value: Number(item.actual_value),

            target_value: Number(item.target_value),

            progress_percentage: Number(item.progress_percentage),

            status: item.status
        });
    });


    const daysInMonth = new Date( year, month, 0).getDate();

    const first_day = new Date( year, month - 1, 1);

    let start_day = first_day.getDay();

    start_day = start_day === 0 ? 6 : start_day - 1;

    const calendar_days = [];

    for (let i = 0; i < start_day; i++) {
        calendar_days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date( year, month - 1, day );

        const formatted_date = formatLocalDate(date);

        const daily = monitoring_map[formatted_date] || [];

    //     console.log(
    // "DATE:",
    // formatted_date,
    // "DATA:",
    // monitoring_map[formatted_date]
// );

        calendar_days.push({
            day,
            date: formatted_date,
            daily
        });
    }
    // console.log("Calendar Days:", calendar_days);
    return calendar_days;
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

        let calendar = [];
        
        if(dailyCategories.length > 0){
            const monitoring  = await monitoringModel.getMonthlyMonitoring(
                user_id, month, year
            )
            calendar = buildCalendar(year, month, monitoring);
        }

        // console.log(user_id, today);

    const dailyMonitoring = await monitoringModel.getDailyMonitoring( user_id, today );
    // console.log("DAILY MONITORING:", dailyMonitoring);
        // //weekly    
        // const { startDate, endDate } = getWeekRange();

        // const weeklyRows =
        //     await monitoringModel.getWeeklyMonitoring(
        //         user_id,
        //         startDate,
        //         endDate
        //     );
        
        // const weeklyMonitoring =
        //     weeklyRows.map(item => {

        //         const actual_value =
        //             Number(item.actual_value);

        //         const target_value =
        //             Number(item.target_value);

        //         let status;

        //         if (actual_value === 0) {
        //             status = "red";

        //         } else if (
        //             actual_value < target_value
        //         ) {
        //             status = "yellow";

        //         } else {
        //             status = "green";
        //         }

        //         const progress_percentage =
        //             (actual_value / target_value) * 100;

        //         return {
        //             ...item,
        //             actual_value,
        //             target_value,
        //             status,
        //             progress_percentage
        //         };
        //     });

         res.render(
            "dashboard/index",
            {
                user: req.session.user,
                dailyCategories,
                calendar,
                month,
                year,
                dailyMonitoring,
                // weeklyMonitoring,
                // startDate,
                // endDate,
                // currentTime,
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