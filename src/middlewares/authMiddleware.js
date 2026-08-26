const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
        alert("You must be logged in to access this page.");
    }
    next();
};

module.exports = { requireAuth };

