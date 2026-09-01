const express = require("express");
const router = express.Router();
const monitoringController = require("../controllers/monitoringController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware.requireAuth);

router.get( "/", monitoringController.testDailyMonitoring);

module.exports = router;