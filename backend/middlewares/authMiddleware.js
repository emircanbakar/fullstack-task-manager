const jwt = require("jsonwebtoken");
const JWT_SEC = process.env.JWT_SEC;

const authMiddleware = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; 

    try {
      const decoded = jwt.verify(token, JWT_SEC);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token doğrulama hatası:", error);
      return res.status(401).json({ message: "Yetkisiz erişim, geçersiz token" });
    }
  } else {
    return res.status(401).json({ message: "Yetkisiz erişim, token bulunamadı" });
  }
};

module.exports = authMiddleware;
