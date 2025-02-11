const mongoose = require("mongoose");
// const bcyrpt = require("bcryptjs")

const authSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// authSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcyrpt.genSalt(10);
//   this.password = await bcyrpt.hash(this.password, salt);
//   next();
// });

module.exports = mongoose.model("Auth", authSchema);
