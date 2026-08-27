const express = require("express");
const router = express.Router();
const targetController = require("../controllers/targetController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware.requireAuth);

router.get("/", targetController.showAllTargets);
router.get("/create", targetController.showCreate);
router.post("/create", targetController.createTarget);
router.get("/edit/:id", targetController.showEdit);
router.post("/edit/:id", targetController.updateTarget);
router.get("/delete/:id", targetController.deleteTarget);
module.exports = router;