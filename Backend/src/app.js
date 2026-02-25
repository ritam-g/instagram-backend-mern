const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());

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

// ✅ Production static serving
if (process.env.NODE_ENV === "production") {
  const publicPath = path.join(__dirname, "..", "public");

  app.use(express.static(publicPath));

  // Express v5 wildcard fix
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

module.exports = app;