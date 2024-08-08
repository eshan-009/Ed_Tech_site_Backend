const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const mailsender = require("../util/mailsender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate")
const otpschema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60*5,
    },
});
async function sendverificationemail(email,otp){

    try{
        const mailres =await mailsender(
            email,
            "Verification Email",
            emailTemplate(otp),
        )
        console.log("Email sent successfully: ", mailres.response);
    }
    catch (error){
        console.log("Error occurred while sending email: ", error);
		throw error;
    }

};

otpschema.pre("save",async (next)=>{
 
        if(this.new)
        {
            await sendverificationemail(this.email,this.otp);
        }
        next();
  
})

module.exports = mongoose.model("OTP",otpschema);