const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
