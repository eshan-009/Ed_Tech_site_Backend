const RatingAndReview = require("../models/RatingReview");
const Coures = require("../models/Course");
const { default: mongoose } = require("mongoose");
const { findOne } = require("../models/User");
const Course = require("../models/Course");
// Create Rating
exports.createrating = async(req,res)=>{
    try{
        const userId =req.user.id;
        const {rating,review,courseId} = req.body;

        const coursedetails = await Course.findOne({_id:courseId},
                                          {studendsEnrolled :{$elemMatch:{$eq:userId}}} );

        if(!coursedetails)
        {
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course',
            });
        }

        const alreadyreviewed = await RatingAndReview.findOne({
            user : userId,
            course: courseId
        });

        if(alreadyreviewed)
        {
            return res.status(403).json({
                success:false,
                message:'Course is already reviewed by the user',
            });
        }

        const ratingreview =await RatingAndReview.create({
            user:userId,
            rating,
            review,
            course:courseId,
        });

        const updatecorse = await Course.findByIdAndUpdate({_id:courseId},
                                                    {
                                                        ratingandreview:ratingreview._id,
                                                    },
                                                    // {new:true},
        );
console.log("Coursedsshsh",updatecorse)
        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingreview,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.getaggregaterating = async(req,res)=>{
    try{
        const {courseId} = req.body;

        const result = await RatingAndReview.aggregate([
            {
            $match:{
                course:new mongoose.Types.ObjectId(courseId),
                
            },
        },
        {
            $group:{
                _id : null,
                averagerating : {$avg : "$rating"},

            }
        }]);

        if(result.length>0)
        {
            return res.status(200).json({
                
                success:true,
              
                AverageRating: result[0].averagerating,
            })
        }

        return res.status(200).json({
            success:true,
            message:'Average Rating is 0, no ratings given till now',
            averageRating:0,
        })
    }
    catch (error) {

        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}