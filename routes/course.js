const express = require("express")
const router = express.Router();
const {createcourse,getallcourses,coursedetail} = require("../controllers/course")
const {createcategory,showallcategories,categorypagedetails} = require("../controllers/category")
const { createsection, updatesection, deletesection } = require("../controllers/section");
const { updatesubsection, deletesubsection, createsubsection } = require("../controllers/subsection");
const { createrating, getaggregaterating, getallrating } = require("../controllers/ratingandreview");
const { auth, isInstructor, isAdmin, isStudent } = require("../middleware/auth");


router.post("/createCourse",auth,isInstructor, createcourse)

router.post("/addSection",auth,isInstructor, createsection)

router.post("/updateSection",auth,isInstructor,updatesection )

router.delete("/deleteSection",auth,isInstructor, deletesection)

router.post("/updateSubSection",auth,isInstructor,updatesubsection )

router.delete("/deleteSubSection",auth,isInstructor, deletesubsection)

router.post("/addSubSection",auth,isInstructor, createsubsection)

router.get("/getAllCourses", getallcourses)

router.post("/getCourseDetails", coursedetail)

router.post("/createCategory", auth ,isAdmin, createcategory)
router.get("/showAllCategories", showallcategories)
router.get("/getCategoryPageDetails",categorypagedetails )



router.post("/createRating",auth,isStudent,createrating )
router.get("/getAverageRating",getaggregaterating)


module.exports = router