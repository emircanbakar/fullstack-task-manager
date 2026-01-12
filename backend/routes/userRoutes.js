const express = require("express");
const {
  register,
  login,
  logout,
  updateProfile,
  updatePassword,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.patch("/profile", authMiddleware, updateProfile);
router.patch("/password", authMiddleware, updatePassword);

module.exports = router;
