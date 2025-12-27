const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    completed: {
      type: String,
      enum: ["not started", "in progress", "completed"],
      default: "not started",
    },
    project: { type: String },
    level: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
