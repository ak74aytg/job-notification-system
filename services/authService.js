const fs = require("fs");
const pdfParse = require("pdf-parse");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {extractSkills} = require("./skillService");


const secretKey = process.env.TOKEN_SECRET;

const loginService = async (req, res) => {
  const { id, password } = req.body;
  try {
    const isPresent = await User.findOne({ id });
    if (isPresent) {
      const isMatch = await bcrypt.compare(password, isPresent.password);
      if (isMatch){
        const token = generateAccessToken(isPresent.id);
        return res.json({ status: "success", data: isPresent, token });
      }
      else return res.send({ error: "incorrect password!" });
    }
    res.send({ status: "failure!" });
  } catch (e) {
    console.log(e);
  }
};



const registerService = async (req, res) => {
  const { name, id, email, password, isCoordinator } = req.body;
  try {
    const isPresent = await User.findOne({
      $or: [{ id: id }, { email: email }],
    });    
    if (isPresent) {
      return res.send({ status: "failed!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    let resumeText = "";
    let resumePath = "";

    // ✅ Parse the PDF
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const parsed = await pdfParse(fileBuffer);
      resumeText = parsed.text;
      resumePath = req.file.path;
    }

    const matchedSkills = extractSkills(resumeText);

    await User.create({
      id: id,
      name: name,
      email: email,
      password: hashedPass,
      isCoordinator,
      skills: matchedSkills,
      resume: resumePath,
    });
    const userData = await User.findOne({ id });
    const token = generateAccessToken(userData.id)
    res.json({status: 'success' ,data: userData, token});
  } catch (e) {
    console.log(e);
    res.json({status : 'error'})
  }
};


const generateAccessToken = (username)=>{
  return jwt.sign(username, secretKey)
}

module.exports = [loginService, registerService];
