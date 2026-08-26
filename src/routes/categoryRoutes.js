const express = require("express");
const categoryController = require("../controllers/categoryController");
const {requireAuth} = require("../middlewares/authMiddleware");

const router = express.Router();

// router.use(authMiddleware); // Apply authentication middleware to all category routes

router.get("/", requireAuth, categoryController.index);
router.get("/create", requireAuth, categoryController.showCreateForm);
router.post("/create", requireAuth, categoryController.create);
router.get("/:id/edit", requireAuth, categoryController.showEditForm );
router.post("/:id/edit", requireAuth, categoryController.update);
router.post("/:id/delete", requireAuth, categoryController.remove);

module.exports = router;