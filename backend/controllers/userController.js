require("dotenv").config();

const User = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

const register = async (req, res) => {
  try {
    const { email, username, password: encodedPassword } = req.body;

    if (!username || !encodedPassword || !email) {
      return res
        .status(400)
        .json({ message: "Lütfen tüm alanları doldurunuz." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu e-posta ile bir hesap zaten var!" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten kullanılıyor!" });
    }

    // AES-256 ile şifreyi çöz
    const decryptedBytes = CryptoJS.AES.decrypt(
      encodedPassword,
      ENCRYPTION_KEY
    );
    const password = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (!password) {
      return res.status(400).json({ message: "Şifre çözülemedi!" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
    });

    return res.status(201).json({ message: "Kayıt başarılı!", data: newUser });
  } catch (error) {
    console.error(error);

    // MongoDB duplicate key hatası kontrolü
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `Bu ${
          field === "email" ? "e-posta" : "kullanıcı adı"
        } zaten kullanılıyor!`,
      });
    }

    return res
      .status(500)
      .json({ message: "Lütfen daha sonra tekrar deneyiniz." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password: encodedPassword } = req.body;

    // AES-256 ile şifreyi çöz
    const decryptedBytes = CryptoJS.AES.decrypt(
      encodedPassword,
      ENCRYPTION_KEY
    );
    const password = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Şifre çözülemedi!" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    // console.log(password);
    // console.log(user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SEC,
      { expiresIn: "1h" }
    );
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Bir hata oluştu, tekrar deneyiniz." });
  }
};

const logout = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Çıkış başarılı!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Çıkış işlemi sırasında bir hata oluştu." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({
        message: "Please provide at least one field to update.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          message: "This email is already in use!",
        });
      }
      user.email = email;
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          message: "This username is already in use!",
        });
      }
      user.username = username;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully!",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "An error occurred while updating profile.",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      currentPassword: encodedCurrentPassword,
      newPassword: encodedNewPassword,
    } = req.body;

    if (!encodedCurrentPassword || !encodedNewPassword) {
      return res.status(400).json({
        message: "Please provide both current and new password.",
      });
    }

    // Decrypt passwords
    const currentPasswordBytes = CryptoJS.AES.decrypt(
      encodedCurrentPassword,
      ENCRYPTION_KEY
    );
    const currentPassword = currentPasswordBytes.toString(CryptoJS.enc.Utf8);

    const newPasswordBytes = CryptoJS.AES.decrypt(
      encodedNewPassword,
      ENCRYPTION_KEY
    );
    const newPassword = newPasswordBytes.toString(CryptoJS.enc.Utf8);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Password decryption failed!" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters!",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect!",
      });
    }

    // Hash and save new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({
      message: "An error occurred while updating password.",
    });
  }
};

module.exports = { login, register, logout, updateProfile, updatePassword };
