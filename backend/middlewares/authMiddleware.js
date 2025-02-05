const jwt = require("jsonwebtoken");

const JWT_SEC = process.env.JWT_SEC;

const authMiddleware = (req, res, next) => {
  const token = req.cookie.token;

  if (!token)
    return res
      .status(401)
      .json({ message: "Yetkisiz Giriş! Lütfen hesabınıza giriş yapınız!" });

  try {
    const decoded = jwt.verify(token, JWT_SEC);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Oturum süresi doldu" });
    // console.error(error)
  }
};

module.exports = authMiddleware;
