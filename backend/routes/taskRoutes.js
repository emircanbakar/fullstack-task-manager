const express = require("express");
const {
  getTasks,
  createTask,
  updateTaskStatus,
} = require("../controllers/taskController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const router = express.Router();

router.route("/").get(authMiddleware, getTasks);
router.route("/").post(authMiddleware, createTask);
router.route("/:id/status").patch(authMiddleware, updateTaskStatus);

module.exports = router;
