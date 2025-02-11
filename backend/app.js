const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API Çalışıyor!");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
