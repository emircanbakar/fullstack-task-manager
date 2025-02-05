const express = require("express");
const { getTasks, createTask } = require("../controllers/taskController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const router = express.Router();

router.route("/").get(authMiddleware, getTasks);
router.route("/").post(authMiddleware, createTask);
module.exports = router;
