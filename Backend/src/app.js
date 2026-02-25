const express = require("express")
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require("path");
const app = express()

app.use(express.static("./public"))
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const userRoute = require("./routes/user.route");

//* UNIVERSAL ROUTE WILL BE HERE which i use to for app.use  
app.use('*name',(req,res)=>{
    //! IF THER IS ANY UNKNOW ROUTE SO IT WILL SHOW THSI INDX.HTML FILE ROUTE 
    //! BUT ITS NOT GOOD OF DING FULL FILE OF THE YOUR SYSTEM 
    //! FOR THAT WE HAVE  
    console.log(__dirname);
      //__dirname is the locaiton of till backend to src file 
    res.sendFile(path.join(__dirname,'..','\\public\\index.html'))
    
})

// Route mounting
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/users', userRoute)



module.exports = app
