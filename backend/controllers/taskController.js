const Task = require("../models/Task");

const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json(tasks);
};

const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

module.exports = { getTasks, createTask };
