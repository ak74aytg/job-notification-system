const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: { 
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  skills: [String],
  preferences: [String],
});

module.exports = mongoose.model("User", userSchema);
