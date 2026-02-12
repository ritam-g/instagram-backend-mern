const mongoose = require("mongoose");

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('connectd to db \n',`OUR WEBSITE IS RUNNING :->>>`+process.env.WEBSITE_URL+`PORT NO`,process.env.PORT);
}
module.exports=connectDB