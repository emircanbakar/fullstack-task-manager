const User = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SEC;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};


const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

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
    const newUser = new User({ username, email, password: passwordHash });
    await newUser.save();

    const token = generateToken(newUser._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({ message: "Kayıt başarılı!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lütfen daha sonra tekrar deneyiniz." });
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Lütfen kullanıcı adı ve şifre giriniz!" });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ message: "Kullanıcı adı veya şifre hatalı!" });
    }

    const token = generateToken(user._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Giriş başarılı!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu, tekrar deneyiniz." });
  }
};

const logout = async (req, res) => {
  try {
    res
      .clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .status(200)
      .json({ message: "Çıkış başarılı!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Çıkış işlemi sırasında bir hata oluştu." });
  }
};


module.exports = { login, register, logout};
 