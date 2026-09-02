const models = require("../models/activityModel");
const monitoringService = require("../services/monitoringService");

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

const getCategoriesByUserId = async (user_id) => {
    const categories = await models.getCategoriesByUserId(user_id);
    return categories;
};

const showAllActivities = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const { date, categoryId } = req.query;

        // Jika berasal dari kalender
        if (date && categoryId) {

            const activities =
                await models.getActivitiesByDateAndCategory(
                    userId,
                    date,
                    categoryId
                );

            return res.render("activities/detail", {
                user_id: req.session.user,
                activities,
                selected_date: date,
                selected_category_id: categoryId
            });
        }

        // Jika membuka menu Activities biasa
        const activities =
            await models.getAllByUserId(userId);

        return res.render("activities/index", {
            user: req.session.user,
            activities
        });

    } catch (error) {
        console.error(error);

        res.status(500).send(
            "Error fetching activities"
        );
    }
};

const showCreateForm = async (req, res) => {
    const userId = req.session.user.id;
    const categories = await models.getCategoriesByUserId(userId);
    const targets = await models.getTargetsByUserId(userId);

    const now = new Date();

    const today =
    `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(
        now.getDate()
    ).padStart(2, "0")}`;

    const currentTime =
            `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    res.render("activities/create", { user: req.session.user, categories, targets, currentTime, today });
}

const addActivity = async (req, res) => {
    const user_id = req.session.user.id;
    const { category_id, name, duration, activity_date, activity_time, notes } = req.body;

    try {
        await models.addActivity(user_id, category_id, name, duration, activity_date, activity_time, notes);
        await monitoringService.updateDailyMonitoring(user_id,activity_date);
        res.redirect("/activities");
    } catch (error) {
        console.error("Error adding activity:", error);
        res.status(500).send("Internal Server Error");
    }
};

const editPage = async (req, res) => {
    const userId = req.session.user.id;
    const activityId = req.params.id;

    const now = new Date();

    const today =
    `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(
        now.getDate()
    ).padStart(2, "0")}`;

    try {
        const activity = await models.findById(activityId, userId);
        const categories = await models.getCategoriesByUserId(userId);

        if (!activity) {
            return res.status(404).send("Activity not found");
        }

        res.render("activities/edit", { user: req.session.user, activity, categories, today });
    } catch (error) {
        console.error("Error fetching activity for update:", error);
        res.status(500).send("Internal Server Error");
    }
};

const updateActivity = async (req, res) => {
    const user_id = req.session.user.id;
    const activity_id = req.params.id;

    const {
        category_id,
        name,
        duration,
        activity_date,
        activity_time,
        notes
    } = req.body;

    try {
        const old_activity = await models.findById(
            activity_id,
            user_id
        );

        if (!old_activity) {
            return res.status(404).send(
                "Activity not found"
            );
        }

        const old_date = formatLocalDate(
            new Date(old_activity.activity_date)
        );

        const new_date = String(activity_date);

        await models.update(
            activity_id,
            user_id,
            category_id,
            name,
            duration,
            activity_date,
            activity_time,
            notes
        );

        const updated_activity = await models.findById(
            activity_id,
            user_id
        );

        // Update monitoring tanggal lama
        await monitoringService.updateDailyMonitoring(
            user_id,
            old_date
        );

        // Kalau tanggal berubah,
        // update monitoring tanggal baru
        if (old_date !== new_date) {
            await monitoringService.updateDailyMonitoring(
                user_id,
                new_date
            );
        }

        console.log(
            "MONITORING BERHASIL DIUPDATE"
        );

        res.redirect("/activities");

    } catch (error) {
        console.error(
            "Error updating activity:",
            error
        );

        res.status(500).send(
            "Internal Server Error"
        );
    }
};

const removeActivity = async (req, res) => {
    // console.log("REMOVE ACTIVITY");
    // console.log("ID:", req.params.id);

    const user_id = req.session.user.id;
    const activity_id = req.params.id;
    try {
        const activity = await models.findById(
            activity_id,
            user_id
        );

        if (!activity) {
            return res.status(404).send("Activity not found");
        }

        await models.remove(
            activity_id,
            user_id
        );

        await monitoringService.updateDailyMonitoring(
            user_id,
            activity.activity_date
        );
        res.redirect("/activities");
    } catch (error) {
        console.error("Error deleting activity:", error);
        res.status(500).send("Internal Server Error");
    }
};

const detailActivity = async (req, res) => {
    try {

        const user_id = req.session.user.id;
        const date = req.query.date;

        const activities =
            await models.getActivitiesByDate(
                user_id,
                date
            );

        res.render(
            "activities/detail",
            {
                user: req.session.user,
                activities,
                date
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Error loading activity detail"
        );
    }
};

module.exports = {
    getCategoriesByUserId,
    showAllActivities,
    showCreateForm,
    addActivity,
    updateActivity,
    editPage,
    removeActivity,
    detailActivity 
};