const models = require("../models/activityModel");

const getCategoriesByUserId = async (user_id) => {
    const categories = await models.getCategoriesByUserId(user_id);
    return categories;
};

const showAllActivities = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const activities = await models.getAllByUserId(userId);
        res.render("activities/index", { activities });
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).send("Internal Server Error");
    }
};

const showCreateForm = async (req, res) => {
    const userId = req.session.user.id;
    const categories = await models.getCategoriesByUserId(userId);

    res.render("activities/create", { user: req.session.user, categories });
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

module.exports = {
    showAllActivities,
    showCreateForm,
    addActivity,
    updateActivity,
    editPage
};