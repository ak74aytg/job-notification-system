const User = require("../models/userSchema");
const Notices = require("../models/noticeSchema");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    console.log(e);
  }
};

const MODEL_BASE_URL = process.env.MODEL_BASE_URL;
const SERVER_BASE_URL = process.env.SERVER_BASE_URL;

const processNotice = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ status: 'failed', message: 'No file uploaded' });
  }

  const { user, title, description } = req.body;

  if(!user) return res.send({status : 'failure'});

  try {
    const form = new FormData();
    form.append("image", fs.createReadStream(req.file.path));

    // Send image to FastAPI server
    const response = await axios.post(`${MODEL_BASE_URL}/match`, form, {
      headers: form.getHeaders(),
    });

    // TO BE WORKED LATER -> we have to send notification to these user 

    // const matched_users = response.data.matches;
    // const user_list = await Promise.all(
    //   matched_users.map(async (user)=>{
    //     return await User.findById(user.user_id);
    //   })
    // )

    const notice_details = response.data.job_details;

    const filename = req.file.filename; // ← Here's your unique filename
    const fileUrl = `/notices/${filename}`;

    const new_notice = await Notices.create({
      user_id: user,
      title: title || notice_details['Job Title'],
      company: notice_details['Company Name'],
      package: notice_details['Pay Package'],
      location: notice_details['Location'] || notice_details.Location,
      last_date_to_apply: notice_details['Last Date'],
      apply_link: notice_details['Apply Link'],
      description: description,
      notice_url: fileUrl
    })

    const saved_notice = await new_notice.save();

    saved_notice.notice_url = `${SERVER_BASE_URL}/${saved_notice.notice_url}`;
    return res.send({
      status: "success",
      notice : saved_notice,
    });

  } catch (error) {
    console.error("Error sending image to FastAPI:", error.message);
    return res.status(500).send({ status: 'error', message: 'model request failed' });
  }
};

const getMyNotices = async (req, res) => {
  const id = req.query.id;
  const notices = await Notices.find( { user_id : id });
  return res.json({status : 'success', notices})
}

module.exports = {
  getAll,
  processNotice,
  getMyNotices
};