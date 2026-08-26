const models = require("../models/targetModel");

const showAllTargets = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const targets = await models.getAllByUserId(userId);
        res.render("targets/index", { targets });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const showCreate = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const categories = await models.getCategoryById(userId);
        res.render("targets/create", { categories });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const createTarget = async (req, res) => {
    try {
        const user_id = req.session.user.id;
        const { category_id, target_value, period, start_date, end_date, target_type } = req.body;

        await models.createTarget(user_id, category_id, target_value, period, start_date, end_date, target_type);
        res.redirect("/targets");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    showAllTargets,
    showCreate,
    createTarget
};