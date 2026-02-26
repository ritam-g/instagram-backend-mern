const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static("./public"))
// CORS


app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://instagram-backend-mern.onrender.com"
  ],
  credentials: true
}));

app.use(cors());

// Routes
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const userRoute = require("./routes/user.route");

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);





module.exports = app;