const express = require("express")
const router = express.Router()
const multer = require('multer');
const path = require("path");
const {getAll, processNotice, getMyNotices} = require('../services/userService')
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "notices/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueId = crypto.randomUUID();
    const uniqueName = `notice_${uniqueId}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

router.get('/all', getAll);
router.get('/notices', getMyNotices)
router.post('/notice/upload', upload.single("notice"), processNotice)

module.exports = router