const express =  require('express');
const app = express();
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload");
const dbconnect = require('./config/database');
require("dotenv").config();

dbconnect();
app.use(express.json());
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const {cloudinaryconnect} = require("./config/cloudinary");

cloudinaryconnect();
const userRoutes =require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/course");

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
const PORT = 3000 || 4000;



app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'

	});
});

app.listen(process.env.PORT,()=>{
    console.log(`Server connected successfully at ${PORT}`);
})

