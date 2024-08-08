const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category")
const {uploadtocloudinary} = require("../util/imageupload");
const { default: mongoose } = require("mongoose");
// Create Course
exports.createcourse = async(req,res)=>{
try{

    const userId = req.user.userid;
var {name,
    description,
    whatyouwillLearn,
    tags,
    category,
    instructions,
    status,
    price
      } = req.body;


const thumbnail = req.files.thumbnailimagee;
console.log("Name",name);
console.log(name,
    description,
    whatyouwillLearn,
    tags,
    category,
    thumbnail,
    price);


if(!name || !description || !whatyouwillLearn ||
    !price ||
    !tags ||
    !thumbnail ||
    !category)
    {
     
        return res.json({
        success:false,
        message:"Fill all required fields",
         
        });
    }
    if (!status || status === undefined) {
        status = "Draft";
    }
const instructordetails = await User.findById(userId,{accounttype:"Instructor"})
console.log("instrtss",instructordetails);
if(!instructordetails)
    {
      return res.json({
            success:false,
            message:"Instructor Details NOT FOUND",
        });
    }

    const categorydetails = await Category.find({_id:category});

    
    if(!categorydetails)
    {
        return res.json({
            success:false,
            message:"Category Details missing",
        })
    }
   console.log("thumbnail",req.files.thumbnailimagee)
    const thumbnailimage = await uploadtocloudinary(req.files.thumbnailimagee,process.env.FOLDER_NAME,100,100);
    
  

    const newcourse  = await Course.create({
        name,
        instructor: instructordetails._id,
        description,
        whatyouwillLearn,
        price,
        category:new mongoose.Types.ObjectId(categorydetails._id),  
        thumbnail:thumbnailimage.secure_url,
        status:status,
        instructions
    });

   
  
   
    console.log("Happy happy",newcourse.category );
    // await User.findByIdAndUpdate(newcourse.instructor,{$push:{enrolledcourses:newcourse._id}},{new:true});
    await User.findByIdAndUpdate(
        {_id: instructordetails._id},
        {
            $push:{
                enrolledcourses :newcourse._id
            },
        },
        {new:true}
    );

    await Category.findByIdAndUpdate(
        {_id: category},
        {
            $push:{
                courses:newcourse._id,
            }
        },
        {new:true}
    );
    res.status(200).json({
        success: true,
        data: newcourse,
        message: "Course Created Successfully",
    });
}


catch (error){
    console.error(error);
   return  res.status(500).json({
        success: false,
        message: "Failed to create course",
        error: error.message,
    });   
}
};
// Get All courses

exports.getallcourses = async(req,res)=>{
    try{

    const coursedata = await Course.find({},{name:true,
        price:true,
        instructor:true,
        ratingandreview:true,
        studentsenrolled:true,
    }
).populate("instructor").exec();

return res.status(200).json({
    success: true,
    data: coursedata,
});

}
    catch (error){
        console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
        
    }
    }
// get course details

exports.coursedetail = async(req,res)=>{
    try{
    const {id:courseId} =req.body;
        const data = await Course.findById(courseId)
                    .populate({
                        path:"instructor",
                        populate: {
                            path:"additionaldetails",
                        },
                    })
                    .populate("category")
                    .populate({
                        path:"coursecontent",
                        populate:{
                            path:"subSection"
                        }
                    }).exec();

            if(!data){
                return res.status(400).json({
                    success:false,
                    message:`Could not find the course with ${courseId}`,
                });
            }

            return res.status(200).json({
                success:true,
                message:"Course Details fetched successfully",
                data:data,
            })
    }
    catch (error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
    }
