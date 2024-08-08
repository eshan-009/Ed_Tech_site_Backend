const User = require("../models/User")
const Profile = require("../models/Profile")
const uploadtocloudinary = require("../util/imageupload")
// Update Profile
exports.updateprofile = async(req,res)=>{
    try{
        const userId = req.body.id;
    const {dateofbirth ,about ,contactnumber} = req.body;

    const userdetails = await User.findById(userId)
    const profiledetails = await Profile.findById(userdetails.additionaldetails);

    profiledetails.dateofbirth=dateofbirth;
    profiledetails.about=about;
    profiledetails.contactNumber=contactnumber;

    await profiledetails.save();
    return res.json({
        success: true,
        message: "Profile updated successfully",
        profiledetails,
    });
    }

    catch (error) {
        console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
    }

}
// deleteAccount

exports.deleteAccount = async(req,res)=>{
    try{
        const {userId} = req.body;
    
        const userdetails = await User.findById(userId)
        

        if(!userId)
        {
            return res.status(404).json({
				success: false,
				message: "User not found",
			});
        }

        const profiledetails = await Profile.find(userdetails.additionaldetails);

        await Profile.findByIdAndDelete({_id:userdetails.additionaldetails})

        await User.findByIdAndDelete({_id : userId});

        res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
    }
    catch (error){

        console.log(error);
		res
			.status(500)
			.json({ success: false, 
                message: "User Cannot be deleted successfully" });
    }
}
// getalluserdetail

exports.getalluserdetails = async(req,res)=>{
    try{
        const {userId} = req.body;
        const userdetails = await User.findById(userId)
                                    .populate("additionaldetails").exec();
    
     res.status(200).json({
     success: true,
     message: "User Data fetched successfully",
     data: userdetails,
                                    });
    }
    catch (error){
        return res.status(500).json({
			success: false,
			message: error.message,
		});
    }
}
// Update DP

exports.updateDp = async(req,res)=>{
    try{
        const {userId} = req.body;
        const newdp = req.files.displaypicture; 
        const newimage = await uploadtocloudinary(newdp,process.env.FOLDER_NAME,
            1000,
            100)
        const updateDP = await User.findByIdAndUpdate({_id: userId},
            {
                image : newimage.secure_url,
            }
        );

        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updateDP,
          })
    
    }
    catch (error){
        return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}
// get Enrolled courses

exports.getEnrolledCourses = async(req,res)=>{
    try{
            const {userId} = req.body;
        
            const userdetails = await User.findOne({_id:userId})
                                    .populate("enrolledcourses").exec();
            if(!userdetails)
                {
                    return res.status(400).json({
                        success: false,
                        message: `Could not find user with id: ${userDetails}`,
                      })
                }     
                
                return res.status(200).json({
                    success: true,
                    data: userDetails.enrolledcourses,
                  })

    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: error.message,
          })
    }
}
