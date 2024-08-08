const Category = require("../models/Category")
// create CAtegory
exports.createcategory = async(req,res)=>{
    try{
        
        const {name,description} = req.body;
       
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }
        const categorydetails = await Category.create({
            name,description
        })

        res.json({
            success:true,
            message:"Category Created Successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
			success: true,
			message: "Errrrrrr",
		});
    }
}
// show All categories
exports.showallcategories = async(req,res)=>{
    try{
        const allcategories = await Category.find({},{name:true,description:true});
        if(!allcategories)
        {
            res.json({
                message:"No Category Exist"
            })
        }
        else{
            return res.status(200).json({
                success:true,
                data: allcategories,
                message:"Category Data Fetched successfully"
            });
        }
    }
    catch (err) {
        res.json({
            success:false,
            message:"Issue in fetching category data"
        });
    }
}
// categoryPagedetails

exports.categorypagedetails = async(req,res)=>{
    try{
        const{categoryId} = req.body;
      
    const selectedcategory = await Category.findById(categoryId)
    .populate("courses").exec();
    
    if(!selectedcategory) {
        return res.status(404).json({
            success:false,
      
        });
    }

    const othercategorydetails = Category.findById({_id:{$ne:categoryId}})
                                    .populate("courses").exec();

                                    return res.status(200).json({
                                        success:true,
                                        data: {
                                            selectedcategory,
                                            othercategorydetails,
                                        },
                                    });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}