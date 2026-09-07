const express = require("express");
const router = express.Router();
const activityWatchController = require("../controllers/activityWatchController");
const {requireAuth} = require("../middlewares/authMiddleware");

router.use(requireAuth);

router.get("/sync", activityWatchController.syncActivityWatch);

module.exports = router;