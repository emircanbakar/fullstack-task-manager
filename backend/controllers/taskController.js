const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("user", "username email");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("getTasks hatası:", error);
    res.status(500).json({ message: "Görevler yüklenirken hata oluştu." });
  }
};

const createTask = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Yetkisiz işlem." });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user.id,
      project: req.body.project,
      level: req.body.level,
      // completed otomatik "not started" olacak (default değer)
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Görev oluşturma hatası:", error);
    res.status(500).json({
      message: "Görev oluşturulken hata oluştu.",
      error: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (!["not started", "in progress", "completed"].includes(completed)) {
      return res.status(400).json({ message: "Geçersiz status değeri." });
    }

    const task = await Task.findByIdAndUpdate(id, { completed }, { new: true });

    if (!task) {
      return res.status(404).json({ message: "Görev bulunamadı." });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Status güncelleme hatası:", error);
    res.status(500).json({ message: "Status güncellenirken hata oluştu." });
  }
};

module.exports = { getTasks, createTask, updateTaskStatus };
