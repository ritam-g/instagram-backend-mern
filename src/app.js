const express = require("express")
const cookieParser = require('cookie-parser');
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const app=express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoute)
app.use('/api/posts',postRoute)
module.exports=app