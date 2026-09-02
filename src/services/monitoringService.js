const monitoringModel = require("../models/monitoringModel");

const categoryModel = require("../models/categoryModel");

const targetModel = require("../models/targetModel");

const activityModel = require("../models/activityModel");

const userModel = require("../models/userModel");

const createDailyMonitoring = async (
    user_id,
    monitoring_date
) => {

    const categories =
        await categoryModel.getAllByUserId(
            user_id
        );

    console.log("CATEGORIES:", categories);    

    for (const category of categories) {
        console.log("CATEGORY:", category);
        const target =
            await targetModel.findDailyByCategory(
                user_id,
                category.id
            );
        
        console.log( "TARGET:", target);

        if (!target) {
            console.log("TARGET TIDAK DITEMUKAN");
            continue;
        }

        const activities =
            await activityModel
                .getActivitiesByDateAndCategory(
                    user_id,
                    monitoring_date,
                    category.id
                );

        let actual_value = 0;

        for (const activity of activities) {
            actual_value += Number(activity.duration);
        }

        const target_value =
            Number(target.target_value);

        let status;

        if (actual_value === 0) {
            status = "red";
        } else if (actual_value < target_value) {
            status = "yellow";
        } else {
            status = "green";
        }


        const progress_percentage =
            target_value > 0
                ? (
                    actual_value /
                    target_value
                ) * 100
                : 0;

        await monitoringModel.create(
            user_id,
            category.id,
            monitoring_date,
            actual_value,
            target_value,
            progress_percentage,
            status
        );
        
    }
};

const createDailyMonitoringForAllUsers = async (
    monitoring_date
) => {

    const users =  await userModel.getAll();
    for (const user of users) {
        await createDailyMonitoring(user.id,monitoring_date);
    }
};

const updateDailyMonitoring = async (
    user_id,
    monitoring_date
) => {

    const categories =
        await categoryModel.getAllByUserId(
            user_id
        );

    for (const category of categories) {

        const target =
            await targetModel.findDailyByCategory(
                user_id,
                category.id
            );

        if (!target) {
            continue;
        }

        const activities =
            await activityModel.getActivitiesByDateAndCategory(
                user_id,
                monitoring_date,
                category.id
            );

        let actual_value = 0;

        for (const activity of activities) {
            actual_value += Number(activity.duration);
        }

        const target_value =
            Number(target.target_value);

        let status;

        if (actual_value === 0) {
            status = "red";
        } else if (actual_value < target_value) {
            status = "yellow";
        } else {
            status = "green";
        }

        const progress_percentage =
            target_value > 0
                ? (actual_value / target_value) * 100
                : 0;

        await monitoringModel.create(
            user_id,
            category.id,
            monitoring_date,
            actual_value,
            target_value,
            progress_percentage,
            status
        );
    }
};

module.exports = {
    createDailyMonitoring,
    createDailyMonitoringForAllUsers,
    updateDailyMonitoring
}