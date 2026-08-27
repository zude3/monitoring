const models = require("../models/targetModel");

const showAllTargets = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const targets = await models.getAllByUserId(userId);
        console.log(targets);
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
        const { category_id, target_value, period, target_type } = req.body;

        await models.createTarget(user_id, category_id, target_value, period, target_type);
        res.redirect("/targets");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const showEdit = async (req, res) => {
    try {
        const target_id = req.params.id;
        const target = await models.findTargetById(target_id);
        if (!target) {
            return res.status(404).send("Target not found");
        }
        res.render("targets/edit", { target });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const updateTarget = async (req, res) => {
    try {
        const target_id = req.params.id;
        const { category_id, target_value, period } = req.body;
        const user_id = req.session.user.id;
        await models.updateTarget(target_id, user_id, category_id, target_value, period);
        res.redirect("/targets");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const deleteTarget = async (req, res) => {
    try {
        const target_id = req.params.id;
        await models.deleteTarget(target_id);
        res.redirect("/targets");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    showAllTargets,
    showCreate,
    updateTarget,
    showEdit,
    createTarget,
    deleteTarget
};