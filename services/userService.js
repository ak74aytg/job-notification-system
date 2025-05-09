require('dotenv').config();
const User = require("../models/userSchema");
const Notices = require("../models/noticeSchema");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const sendPushNotification = require("../utils/sendNotification");

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


    const notice_details = response.data.job_details;

    const filename = req.file.filename; // ← Here's your unique filename
    const fileUrl = `notices/${filename}`;

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

    const matched_users = response.data.matches;
    await Promise.all(matched_users.map(async (user)=>{
      const matchedUser = await User.findByIdAndUpdate(user.user_id, {
          $push: {
            notifications: {
              notice_id: saved_notice._id,
              message: `New job posted: ${saved_notice.title || 'Job Opportunity'}`
            }
          }
        });
        if (matchedUser?.device_token) {
          await sendPushNotification(
            matchedUser.device_token,
            "New Job Opportunity!",
            saved_notice.title || 'Check out the new job posting!'
          );
        }
      })
    )

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

const getAllNotices = async (req, res) => {
  const notices = await Notices.find();
  const updatedNotices = await Promise.all(
    notices.map(async (notice)=>{
      const user = await User.findById(notice.user_id);
      const { user_id, ...item} = notice.toObject();;
      return {
        ...item,
        'user' : {
          name : user?.name || 'unknown',
          id : user?.id || '-1',
        }
      }
    })
  )
  return res.json({status : 'success', notices : updatedNotices.reverse()})
}

const getNotifications = async (req, res) => {
  const { userId } = req.query;
  const user = await User.findById(userId).populate("notifications.notice_id");
  if (!user) return res.status(404).json({ status: "error", message: "User not found" });
  
  return res.json({
    status: "success",
    notifications: user.notifications.reverse(), // latest first
  });
};

const markNotificationsRead = async (req, res) => {
  const { userId } = req.body;
  await User.updateOne(
    { _id: userId },
    { $set: { "notifications.$[].read": true } }
  );
  return res.json({ status: "success" });
};

const updateDeviceToken = async (req, res) => {
  const { userId, device_token } = req.body;
  try {
    await User.findByIdAndUpdate(userId, { device_token });
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const updateNotice = async (req, res) => {
  const {
    noticeId,
    userId,
    title,
    company,
    package,
    location,
    last_date_to_apply,
    apply_link,
    description,
  } = req.body;

  try {
    const notice = await Notices.findById(noticeId);
    if (!notice) {
      return res
        .status(404)
        .json({ status: "failure", message: "Notice not found" });
    }

    if (!userId || notice.user_id.toString() !== userId) {
      return res
        .status(403)
        .json({
          status: "failure",
          message: "Unauthorized to update this notice",
        });
    }

    if (title !== undefined) notice.title = title;
    if (company !== undefined) notice.company = company;
    if (package !== undefined) notice.package = package;
    if (location !== undefined) notice.location = location;
    if (last_date_to_apply !== undefined)
      notice.last_date_to_apply = last_date_to_apply;
    if (apply_link !== undefined) notice.apply_link = apply_link;
    if (description !== undefined) notice.description = description;

    const updatedNotice = await notice.save();

    res.json({ status: "success", notice: updatedNotice });
  } catch (error) {
    console.error("Error updating notice:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Server error while updating notice" });
  }
};

const getOneNotice = async (req, res) => {
  const { noticeId } = req.query;
  const notice = await Notices.findById(noticeId);
  return res.send({ "status" : "success", "notice": notice });
}


module.exports = {
  getAll,
  processNotice,
  getMyNotices,
  getAllNotices,
  updateDeviceToken,
  markNotificationsRead,
  getNotifications,
  updateNotice,
  getOneNotice,
};