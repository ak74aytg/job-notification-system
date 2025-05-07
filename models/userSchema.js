const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  email: { 
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  isCoordinator : {
    type : Boolean,
    required: true,
    default: false,
  },
  resume:{
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
