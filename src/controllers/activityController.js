const models = require("../models/activityModel");

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

    const currentTime =
            `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    res.render("activities/create", { user: req.session.user, categories, targets, currentTime });
}

const addActivity = async (req, res) => {
    const user_id = req.session.user.id;
    const { category_id, name, duration, activity_date, activity_time, notes } = req.body;

    try {
        await models.addActivity(user_id, category_id, name, duration, activity_date, activity_time, notes);
        res.redirect("/activities");
    } catch (error) {
        console.error("Error adding activity:", error);
        res.status(500).send("Internal Server Error");
    }
};

const editPage = async (req, res) => {
    const userId = req.session.user.id;
    const activityId = req.params.id;

    try {
        const activity = await models.findById(activityId, userId);
        const categories = await models.getCategoriesByUserId(userId);

        if (!activity) {
            return res.status(404).send("Activity not found");
        }

        res.render("activities/edit", { user: req.session.user, activity, categories });
    } catch (error) {
        console.error("Error fetching activity for update:", error);
        res.status(500).send("Internal Server Error");
    }
};

const updateActivity = async (req, res) => {
    const userId = req.session.user.id;
    const activityId = req.params.id;
    const { category_id, name, duration, activity_date, activity_time, notes } = req.body;

    try {
        await models.update(activityId, userId, category_id, name, duration, activity_date, activity_time, notes);
        res.redirect("/activities");
    } catch (error) {
        console.error("Error updating activity:", error);
        res.status(500).send("Internal Server Error");
    }
};

const removeActivity = async (req, res) => {
    const userId = req.session.user.id;
    const activityId = req.params.id;
    try {
        await models.remove(activityId, userId);
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