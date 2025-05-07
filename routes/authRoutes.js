const express = require("express")
const router = express.Router()
const multer = require('multer');
const path = require("path");
const fs = require("fs");
const [loginService, registerService] = require("../services/authService");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const userId = req.body.id || "unknown";
    const ext = path.extname(file.originalname);
    const uniqueName = `${userId}_${Date.now()}_${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });


router.post('/login', loginService)
router.post("/register", upload.single("resume"), registerService);

module.exports = router





// const timelog = (req, res, next)=>{
//     console.log("Time :"+Date.now())
//     next()
// }


// router.use(timelog)