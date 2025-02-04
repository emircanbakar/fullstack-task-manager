const User = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SEC;

const register = async () => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "lütfen bütün alanları doldurunuz" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Bu e-posta ile bir hesap daha önceden oluşturulmuş.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: passwordHash });
    await newUser.save();

    res.status(201).json({ message: "Kayıt Başarılı!" });
    console.log(token)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lütfen daha sonra tekrar kayıt olmayı deneyiniz." });
    console.error(error, "error");
  }
};

const login = async () => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res
        .status(400)
        .json({ message: "Lütfen kullanıcı adı ve şifre bilginizi giriniz!" });
    }

    const user = await User.findOne({ username });
    if (!user) res.status(400).json({ message: "Böyle bir kullanıcı yok!" });

    const isUserMatch = await bcrypt.compare(password, user.password);
    if (!isUserMatch)
      res.status(400).json({ message: "Giriş Bilgileri Hatalı!" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Giriş Başarılı!", token });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { login, register };
