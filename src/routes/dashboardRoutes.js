const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/", requireAuth, dashboardController.index);

module.exports = router;