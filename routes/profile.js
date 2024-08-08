const express = require("express");
const { updateprofile, deleteAccount, getalluserdetails, updateDp, getEnrolledCourses } = require("../controllers/profile");
const router = express.Router();
const {auth} = require("../middleware/auth")

router.delete("/deleteProfile", auth ,deleteAccount)
    router.put("/updateProfile",auth,updateprofile)
    router.get("/getUserDetails",auth,getalluserdetails )
    router.get("/getEnrolledCourses",auth, getEnrolledCourses)
    router.put("/updateDisplayPicture",auth,updateDp)

module.exports = router