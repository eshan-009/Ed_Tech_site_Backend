const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const sectionschema = new mongoose.Schema({
    sectionName:{
        type:String,
        required:true,
    },
    subSection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subsection",
        required:true,
    }],
});

module.exports = mongoose.model("Section",sectionschema);