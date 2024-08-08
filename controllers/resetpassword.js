
// Reset passwordtoken
const bcrypt = require("bcrypt")
const User = require("../models/User");
const crypto = require("crypto");

exports.resetpasswordtoken = async(req,res)=>{
    try{
        const {email} = req.body;
        
        const checkuser = await User.findOne({email});
        

        if(!checkuser)
        {
            return res.json({
                success:false,
                message:"User Does not exist",
            })
        }

        const token = crypto.randomBytes(10).toString('hex');
        console.log("Apple1",token)
        const updatedetails = await User.findOneAndUpdate(
            
                {email:email},
                {
                    token:token,
                    resetPasswordExpires:Date.now() + 3600000,
                }
            
        );
        const url = `http://localhost:3000/update-password/${token}`;

            // await mailsender(
            //     email,
            //     "Password Reset",
            //     `Your Link for email verification is ${url}. Please click this url to reset your password.`
            // );
            
            res.json({
                success: true,
                message: "Email Sent Successfully, Please Check Your Email to Continue Further",
                data: url,
            });


    }
    catch (error) {
        return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
    }
}
// reset PAssword
exports.resetpassword = async(req,res)=>{
   try{
    const {password,confirmpassword,token} = req.body;

    if(password!==confirmpassword)
    {
        return res.json({

        })
    }

    const checkexpiry = await User.findOne({token:token});
   
    if(!checkexpiry)
    {
        return res.json({
            success: false,
            message: "Token is Invalid",
        });
    }
    if(Date.now()>checkexpiry.resetPasswordExpires)
    {
        return res.status(403).json({
            success: false,
            message: `Token is Expired, Please Regenerate Your Token`,
        });
    }
    console.log("EXPPPP",password);
    const encryptedpassword = await bcrypt.hash(password,10);
    
    const updateuser = await User.findOneAndUpdate({token:token},
        {
            password:encryptedpassword,
        }
       
    );
    
    res.json({
        success: true,
        message: `Password Reset Successful`,
    });
   }
   catch (error){
    return res.json({
        error: error.message,
        success: false,
        message: `Some Error in Updating the Password`,
    });
   }

}