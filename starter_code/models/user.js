const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: {
      type: String,
      required: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/]
    },
    firstname: String,
    lastname: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
