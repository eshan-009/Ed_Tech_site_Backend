const Section = require("../models/Section");
const { findById, findByIdAndUpdate } = require("../models/User");
const Course = require("../models/Course")
// Create Section
exports.createsection = async(req,res)=>{
    

    try{
        const {courseId,sectionname} = req.body;

  
        const newsection = await Section.create({ sectionName: sectionname })
       const  updatecourse = await Course.findByIdAndUpdate(courseId,
            {
                $push:{coursecontent :newsection._id}
            },
            {new:true}
        ).populate("coursecontent")
        .exec();
        console.log("apple",newsection._id)
        res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatecourse,
        });
    }
    catch (error){
        res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
    }
}


// Update Section

exports.updatesection = async(req,res)=>{
    try{
        const {sectionname,sectionId} =req.body;

    const sectiondetail = await Section.findByIdAndUpdate(sectionId,
                                        {
                                            sectionName:sectionname,
                                        });
            res.status(200).json({
                success: true,
                message: sectiondetail,
            });
    }
    catch (error) {
        console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
    }
}
// Delete Section

exports.deletesection = async(req,res)=>{
    try{
        const {sectionId} = req.body;
       
         await Section.findByIdAndDelete(sectionId);

        res.status(200).json({
			success: true,
			message: "Section deleted",
		});
    }
    catch (error) {
        console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
    }
}