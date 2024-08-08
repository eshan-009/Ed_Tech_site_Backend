const mongoose = require("mongoose");
const User = require("./User")
const courseschema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    description:{
        type:String,
        required:true,
    },
    whatyouwillLearn:{
        type:String
    },
    coursecontent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    },
    ratingandreview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingandReview",
    }],
    tags:{
        type:[String],
        required:true,
    },
    thumbnail:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studendsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
    }],
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    price:{
        type: Number,
    }

});

module.exports = mongoose.model("Course",courseschema);