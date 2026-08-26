const bcrypt = require("bcrypt");
const models = require("../models/categoryModel");

const index = async (req, res) => {
    res.render("dashboard");
}

module.exports = { index };