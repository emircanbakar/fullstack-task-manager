const Auth = require("../models/Auth");
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
      return res
        .status(400)
        .json({
          message: "Bu e-posta ile bir hesap daha önceden oluşturulmuş.",
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: passwordHash });
    await newUser.save();

    res.status(201).json({ message: "Kayıt Başarılı!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lütfen daha sonra tekrar kayıt olmayı deneyiniz." });
    console.error(error, "error");
  }
};
