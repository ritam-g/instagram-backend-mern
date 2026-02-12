const express = require("express")
const cookieParser = require('cookie-parser');
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const app=express()

app.use(express.json())
app.use(cookieParser())
app.post('/',(req,res)=>{
    res.status(200).json({
        message:'welcome to you socila media website '
    })
})

app.use('/api/auth',authRoute)
app.use('/api/posts',postRoute)
module.exports=app