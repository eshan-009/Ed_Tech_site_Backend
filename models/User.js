const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    enrolledcourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    additionaldetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
    },
    courseprogress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgess",
    },
    accounttype:{
        type:String,
        enum:["Student","Instructor","Admin",]
    },
    image:{
        type:String,
    },
    token : {
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    }


},
{timestamp:true}

);
module.exports = mongoose.model("User",userschema);