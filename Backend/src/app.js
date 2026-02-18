const express = require("express")
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const userRoute = require("./routes/user.route");

// Root endpoint
app.post('/', (req, res) => {
    res.status(200).json({
        message: 'welcome to your social media website '
    })
})

// Route mounting
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/users', userRoute)

module.exports = app
