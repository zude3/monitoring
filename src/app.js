const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const activityRoutes = require("./routes/activityRoutes");
const targetRoutes = require("./routes/targetRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/categories", categoryRoutes);
app.use("/activities", activityRoutes);
app.use("/targets", targetRoutes);

app.get("/", (req, res) => {
    res.redirect("/auth/login");
});

module.exports = app;