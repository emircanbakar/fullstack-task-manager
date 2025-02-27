const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("user", "username email"); 
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Görevler yüklenirken hata oluştu." });
  }
};

const createTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Yetkisiz işlem." });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user.username, 
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Görev oluşturulurken hata oluştu." });
  }
};

module.exports = { getTasks, createTask };
