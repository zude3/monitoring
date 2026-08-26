const bcrypt = require("bcrypt");
const models = require("../models/categoryModel");

const index = async (req, res) => {
    try{
        console.log(req.session);
        console.log(req.session.user);
        const categories = await models.getAllByUserId(req.session.user.id);
        
        res.render("categories/index", { categories, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching categories");
    }
}

const showCreateForm = (req, res) => {
    res.render("categories/create", { user: req.session.user });
}

const create = async (req, res) => {
    try {
        const { categoryName, icon } = req.body;
        await models.create(req.session.user.id, categoryName, icon);  
        res.redirect("/categories");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating category");
    }
}

const showEditForm = async (req, res) => {
    try {
        const category = await models.findById(req.params.id, req.session.user.id);
        if(!category) {
            return res.status(404).send("Category not found");
        }
        res.render("categories/edit", { category, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching category");
    }
}

const update = async (req, res) => {
    try {
        const { categoryName, icon } = req.body;
        const update = await models.update(req.params.id, req.session.user.id, categoryName, icon);
        if(update.affectedRows === 0) {
            return res.status(404).send("Category not found or you don't have permission to update it");
        }

        res.redirect("/categories");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating category");
    }
}   

const remove = async (req, res) => {
    try {
        const remove = await models.remove(req.params.id, req.session.user.id);
        if(remove.affectedRows === 0) {
            return res.status(404).send("Category not found or you don't have permission to delete it");
        }

        res.redirect("/categories");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error removing category");
    }
}

module.exports = {
    index,
    showCreateForm,
    create,
    showEditForm,
    update,
    remove
};
