const express = require("express")
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require("path");
const app = express()

app.use(express.json())
app.use(cookieParser())

// Allow requests from local dev AND deployed frontend on Render
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL  // e.g. https://your-app.onrender.com
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}))

const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const userRoute = require("./routes/user.route");

// ✅ API routes MUST come BEFORE the wildcard catch-all
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/users', userRoute)

// Serve the built frontend (dist/public folder)
app.use(express.static(path.join(__dirname, '..', 'public')))

// ✅ Wildcard comes LAST — sends index.html for any non-API route (React router support)
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})



module.exports = app
