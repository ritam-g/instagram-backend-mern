const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static("./public"))
// CORS
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    })
);

// Routes
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const userRoute = require("./routes/user.route");

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);


app.use('*name',(req,res)=>{
    //! IF THER IS ANY UNKNOW ROUTE SO IT WILL SHOW THSI INDX.HTML FILE ROUTE 
    //! BUT ITS NOT GOOD OF DING FULL FILE OF THE YOUR SYSTEM 
    //! FOR THAT WE HAVE  
    console.log(__dirname);
      //__dirname is the locaiton of till backend to src file 
    res.sendFile(path.join(__dirname,'..','\\public\\index.html'))
    
})


module.exports = app;