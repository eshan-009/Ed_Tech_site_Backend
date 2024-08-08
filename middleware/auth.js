const User = require("../models/User");
const jwt = require("jsonwebtoken")
require("dotenv").config();

exports.auth = (req,res,next)=>{
  
    try{

        const token =  req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        console.log
    try{
   if(!token){
    return res.json({
        success:false,
        message:"Token Missing",
    });
   }

   const decode = jwt.verify(token,process.env.jwt_secret);

   req.user = decode;
}
catch{
    (err)=>{
        console.log("Invalid Token",err);
    }
}

next();
    }
    catch{
        (err)=>{
            console.log("Something went wrong while Authentication",err);
        }

    }
};

exports.isStudent = async(req,res,next)=>{

try{
    if(req.user.accounttype !== "Student"){
        return res.json({
            message: "This is a protected route for Students only"
        })
    }
    next();
}
catch{
   return res.json({
    success:false,
    message:"User role cannot be verified",
    })
}
};
exports.isInstructor = async(req,res,next)=>{
    
    try{
      
        if(req.user.accounttype !== "Instructor"){
            return res.json({
                message: "This is a protected route for Instructors only"
            })
        }
      
        next();
    }
    catch{
       return res.json({
        success:false,
        message:"User role cannot be verified",
        })
    }
    };

exports.isAdmin = async(req,res,next)=>{

        try{
            if(req.user.accounttype !== "Admin"){
                return res.json({
                    message: "This is a protected route for Admins only"
                })
            }
            next();
        }
        catch{
           return res.json({
            success:false,
            message:"User role cannot be verified",
            })
        }
        };