const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const secretKey = process.env.TOKEN_SECRET;

const loginService = async (req, res) => {
  const { id, password } = req.body;
  try {
    const isPresent = await User.findOne({ id });
    if (isPresent) {
      const isMatch = await bcrypt.compare(password, isPresent.password);
      if (isMatch){
        const token = generateAccessToken(isPresent.id);
        return res.json({ status: "logged in successfully", data: isPresent, token });
      }
      else return res.send({ error: "incorrect password!" });
    }
    console.log(token)
    res.send({ error: "no user found!" });
  } catch (e) {
    console.log(e);
  }
};



const registerService = async (req, res) => {
  const { name, id, password } = req.body;
  try {
    const isPresent = await User.findOne({
      $or: [{ id }],
    });
    if (isPresent) {
      return res.send({ errors: "user already registered!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    await User.create({
      name: name,
      id: id,
      password: hashedPass,
    });
    const userData = await User.findOne({ id });
    const token = generateAccessToken(userData.id)
    res.json({status: 'registration successfull' ,userData, token});
  } catch (e) {
    console.log(e);
  }
};


const generateAccessToken = (username)=>{
  return jwt.sign(username, secretKey)
}

module.exports = [loginService, registerService];
