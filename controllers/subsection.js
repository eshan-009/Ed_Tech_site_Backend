const Section = require("../models/Section");
const Subsection = require("../models/Subsection");
const { uploadtocloudinary } = require("../util/imageupload");
require("dotenv").config();
// Create Subsection
exports.createsubsection = async(req,res)=>{
try{
const {sectionId,title,description} =req.body;
const video = req.files.videofile;



if(!sectionId || !title || !description)
{
    return res.json({
        success:false,
        message:"Fill All details"
    });
}
const uploaddetails = await uploadtocloudinary(video,process.env.FOLDER_NAME);

const subsectiondetails = await Subsection.create({
    title,
    timeDuration:`${uploaddetails.duration}`,
    description,
    videoUrl:uploaddetails.secure_url,

    
});

// const updatesection = await Section.findByIdAndUpdate(sectionId,
//                                                 {
//                                                   $push:{coursecontent:subsectiondetails._id}
//                                                 },{new:true}).populate("subSection").exec();


  const updatesection = await Section.findById(sectionId);
  updatesection.subSection.push(subsectiondetails._id);
  await updatesection.save();

 return res.status(200).json({ success: true,
                         data: updatesection });                                                

}
catch (error) {
    console.error("Error creating new sub-section:", error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,});
}
};

// Update Subsection


exports.updatesubsection = async(req,res)=>{
    try{
        const {sectionId,title,description} = req.body;
         const {subsectionId} = req.body;
        
        const section = await Section.findById(sectionId);
        const subsection = await Subsection.findById(subsectionId);
        if(!section)
        {
            return res.json({
                success:false,
                message:"Section doesnot exist"
            });
        }
        if(title!==undefined)
        {
            subsection.title = title;
        }

        if(description!==undefined)
            {
                subsection.description = description;
            }
       
       
        if(req.files && req.files!==undefined)
        {
            const newvideo = req.files.videofile;
            const videoupload = await uploadtocloudinary(newvideo,process.env.FOLDER_NAME);
            subsection.timeDuration=`${videoupload.duration}`
            subsection.videoUrl =  videoupload.secure_url
        
        }
        await subsection.save();

        return res.json({
            success: true,
            message: "Section updated successfully",
          })
    }
    catch (error) {
        console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
    };
// Delete Subsection


exports.deletesubsection = async(req,res)=>{
   
        

  try{
    const {subsectionId,sectionId} = req.body;
    await Section.findByIdAndUpdate(
        {_id:sectionId},
        {
            $pull:{
                subSection:subsectionId,
            },
        },
        {new:true},);


const subsection = await Subsection.findByIdAndDelete(subsectionId) ;

return res.json({
success: true,
message: "SubSection deleted successfully",
})
  }
  catch (error){
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
    
    }