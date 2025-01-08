const express = require("express")
const router = express.Router()
const [loginService, registerService] = require("../services/authService");



router.post('/login', loginService)
router.post('/register', registerService)



module.exports = router





// const timelog = (req, res, next)=>{
//     console.log("Time :"+Date.now())
//     next()
// }


// router.use(timelog)