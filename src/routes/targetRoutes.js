const express = require("express");
const router = express.Router();
const targetController = require("../controllers/targetController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware.requireAuth);

router.get("/", targetController.showAllTargets);
router.get("/create", targetController.showCreate);
router.post("/create", targetController.createTarget);
module.exports = router;