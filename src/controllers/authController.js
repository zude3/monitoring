const bcrypt = require("bcrypt");
const models = require("../models/userModel");

const showRegister = (req, res) => {
    res.render("auth/register");
}

const showLogin = (req, res) => {
    res.render("auth/login");
}

const register = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        const existingUser = await models.findByEmail(email);
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await models.createUser(name, email, hashedPassword);
        res.redirect("/auth/login");

    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user");
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await models.findByEmail(email);
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

        req.session.user = { id: user.id, name: user.username, email: user.email };

        req.session.save((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error saving session");
            }
            res.redirect("/dashboard");
        });
        console.log(req.session);
        console.log(req.session.user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in");
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error logging out");
        }
        res.redirect("/auth/login");
    });
};

module.exports = { showRegister, showLogin, register, login, logout };