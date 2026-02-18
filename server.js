require('dotenv').config()
const app = require("./src/app");
const connectDB = require("./src/config/database");

connectDB()

app.listen(process.env.PORT, () => {
    console.log('server is running');
})
