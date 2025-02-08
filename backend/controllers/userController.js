const User = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SEC;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET tanımlı değil! .env dosyanızı kontrol edin.");
}

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });
};

// ✅ KAYIT OL
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

    return res
      .cookie("token", token, { httpOnly: true })
      .status(201)
      .json({ message: "Kayıt başarılı!", token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Lütfen daha sonra tekrar deneyiniz." });
  }
};

// ✅ GİRİŞ YAP
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Lütfen kullanıcı adı ve şifre giriniz!" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Kullanıcı adı hatalı!" });
    }

    console.log("JWT_SECRET:", process.env.JWT_SEC);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password, user.password)
    console.log(isMatch)
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Kullanıcı adı veya şifre hatalı! bcyrpt" });
    }

    const token = generateToken(user._id);

    return res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ message: "Giriş başarılı!", token });
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
