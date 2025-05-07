const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noticeSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
  title : String,
  company : String,
  package : String,
  location : String,
  last_date_to_apply : String,
  apply_link : String,
  description: String,
  notice_url : String,
});

module.exports = mongoose.model("Notice", noticeSchema);
