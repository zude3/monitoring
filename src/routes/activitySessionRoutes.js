const express = require("express");
const router = express.Router();
const activitySessionController =
    require("../controllers/activitySessionController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.use(requireAuth);

router.get(
    "/create",
    activitySessionController.createActivitySessions
);

module.exports = router;