require("dotenv").config();

const User = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const register = async (req, res) => {


  // req.bodyde gönderilen password base64 ile şifrelenebilir
  try {
    const { email, username, password } = req.body;

    // const encryptedpass = await bcrypt.hash(password,10);
    
    // const check = await bcrypt.compare(password, encryptedpass);
    // console.log(encryptedpass)

    // return res.status(200).json({ message: "Kayıt başarılı!", data: check });

    if (!username || !password || !email) {
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

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
    });

    return res.status(201).json({ message: "Kayıt başarılı!", data: newUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Lütfen daha sonra tekrar deneyiniz." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
      { id: user._id, email: user.email },
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
