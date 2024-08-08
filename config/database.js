const mongoose = require("mongoose");
require("dotenv").config();

const dbconnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(console.log("Database connection Successful"))
    .catch((err)=>{
        console.error(err);
        console.log("Erron in DB conncetion");
    }
    )
}

module.exports = dbconnect;