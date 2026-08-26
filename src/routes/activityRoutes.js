const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware.requireAuth);

router.get("/", activityController.showAllActivities);
router.get("/create", activityController.showCreateForm);
router.post("/create", activityController.addActivity);
router.get("/:id/edit", activityController.editPage);
router.post("/:id/edit", activityController.updateActivity);
router.post("/:id/delete", activityController.removeActivity);

module.exports = router;