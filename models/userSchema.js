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
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isCoordinator: {
    type: Boolean,
    required: true,
    default: false,
  },
  resume: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  skills: [String],
  preferences: [String],
  notifications: [
    {
      notice_id: {
        type: Schema.Types.ObjectId,
        ref: "Notice",
      },
      message: String,
      read: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  device_token: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
