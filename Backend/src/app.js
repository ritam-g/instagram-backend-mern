const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

// CORS configuration – only call once and keep credentials enabled.  When the
// frontend is deployed to a different origin make sure that origin is added
// to the list below (you can use an environment variable instead of hard‑coding
// so your Render configuration can be changed without editing code).
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://instagram-backend-mern.onrender.com',
  // add your frontend render URL here if it is different
  // e.g. 'https://instagram-frontend-12345.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true
}));

// Routes
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const userRoute = require("./routes/user.route");

app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/users', userRoute);

// All other routes should serve the React app (single‑page application).
// This ensures that client‑side routing (React Router / Vite) works when the
// user reloads the page or navigates directly to a nested URL.  Render’s Node
// version uses a newer path-to-regexp library which rejects the raw '*' string
// (see deployment error).  Use '/*' or a middleware instead.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});





module.exports = app;