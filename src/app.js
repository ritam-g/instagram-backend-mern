const express = require("express")
const cookieParser = require('cookie-parser');

const app=express()

app.use(express.json())
app.use(cookieParser())


const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");


app.post('/',(req,res)=>{
    res.status(200).json({
        message:'welcome to you social media website '
    })
})

app.use('/api/auth',authRoute)
app.use('/api/posts',postRoute)
module.exports=app