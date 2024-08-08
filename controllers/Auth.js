const res = require("express/lib/response");
const User = require("../models/User");
const Profile = require("../models/Profile")
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt")
const otpGenerator = require('otp-generator')
const jwt = require("jsonwebtoken")
exports.signup = async(req,res)=>{
    try{
        const{
            name,
            email,
            password,
            confirmpassword,
            additionaldetails,
            accounttype,
            otp
        } = req.body;
// console.log(req.body);
        if(!name || !email || !password ||
             !confirmpassword || !accounttype || !otp)
             {
                return res.json({
                    success:false,
                    message:"All field are mandatory",
                })
             }

        if(password !== confirmpassword)
        {
            res.json({
                success:false,
                message:"Password and confirmpassword does not match",
            });
        };
        const existinguser = await User.findOne({email});
        // console.log("existinguser",existinguser);
        if(existinguser){
            return res.json({
                success:false,
                message:"User already exists",
            })
        };

        const response = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        // console.log("response",response[0].email);

            // Check for !response
        if(response.length === 0)
        {
            return res.json({
                success:false,
                message:"Please Generate OTP",
            })
        }

    //    onsole.log("responseOTP is :",response[0].otp);
    //    console.log("OTP is :",otp);
        if(otp!==response[0].otp)
        {
            return res.json({
                success:false,
                message:"Otp Doesn't match",
            });
        }
        
        let hashedpassword;
      
            hashedpassword = await bcrypt.hash(password,10);
           
            const profile = await Profile.create({
                gender:null,
                dateofbirth:null,
                about:null,
                contactnumber:null,
            });
          
           try{
            const createuser = await User.create({
                name,
                email,
                password : hashedpassword,
                additionaldetails:profile._id,
                accounttype,
                image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
            
              });
              return res.status(200).json({
                success: true,
                
                message: "User registered successfully",
            });
           }
           catch (err){
               console.log("errrr is ------>>>>",err);
           }
           
            
    }
    catch{
        (err)=>{
            console.error(err);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
        }
    }
};

exports.login = async(req,res)=>{
    try{
        console.log("email",req.body.email);
        const{email,password} = req.body;
        
    if(!email || !password)
    {
        return res.json({
            success:false,
            message:"Please Fill all required fields",
        })
    }

    const user = await User.findOne({email}).populate("additionaldetails");

    if(!user)
    {
        return res.json({
            success:false,
            message:"User Not registered"
        });
    }
    if(await bcrypt.compare(password,user.password))
    {
        const token = jwt.sign({email:user.email,userid:user._id,accounttype:user.accounttype},
                    process.env.jwt_secret,
                {
                    expiresIn:"24h",
                }
            )
   

    user.token = token;
    user.password = undefined;

    const options ={
        expiresIn:new Date(Date.now()*3*24*60*60*1000),
        httpOnly:true,
    }

    res.cookie("token",token,options).json({
        success:true,
        token,
        user,
        message:"Login Success",
    })

}
else
{
    res.json({
        success:false,
        message:"Password doesn't match",
    })
}
    }

catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
    });
}

};

exports.sendotp = async(req,res)=>{

    try{
        const{email} = req.body;

    const existinguser = await OTP.findOne({email});

    if(existinguser)
    {
        return res.json({
            message:"User Already Present",
        })
    }

    var otp = otpGenerator.generate(6, 
        { upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
             specialChars: false });

    const result = await OTP.findOne({otp:otp});
    
    while(result)
    {
       otp= otpGenerator.generate(6, 
            { upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                 specialChars: false });

    }
    const otp_payload = {email , otp};
// console.log("OTP data" ,otp_payload)
    const otpbody = await OTP.create(otp_payload);

    res.status(200).json({
        success: true,
        message: `OTP Sent Successfully`,
        otp,
    });
    }

 catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
}

}