var cloudinary = require('cloudinary').v2;

exports.uploadtocloudinary = async (file,folder,height,quality)=>{
    const options = {folder};
    if(height){
        options.height = height;
    };
    if(quality){
        options.quality = quality;
    };

    console.log("Temp",file.tempFilePath)
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}