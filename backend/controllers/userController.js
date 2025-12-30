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

module.exports = { login, register, logout };
