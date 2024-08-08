const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const courseprogressschema = new mongoose.Schema({
courseId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
},
completedvideos:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Subsection",
}
});

module.exports = mongoose.model("CourseProgress",courseprogressschema);