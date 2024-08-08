const express = require("express");
const { auth } = require("../middleware/auth");
const { login, signup, sendotp } = require("../controllers/Auth");
const { resetpassword, resetpasswordtoken } = require("../controllers/resetpassword");
const router = express.Router();


router.post("/login", login)


router.post("/signup", signup)

router.post("/sendotp", sendotp)


router.post("/reset-password-token", resetpasswordtoken)

router.post("/reset-password", resetpassword)


module.exports = router