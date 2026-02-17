const jwt = require("jsonwebtoken");
async function identifyUser(req, res, next) {
    const token = req.cookies.token
    let decode = null
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        console.log(err);

        return res.status(404).json({
            message: err.message,
            message2: 'token is invalid'
        })
    }

    req.user = decode//NOTE - this will pass on controller
    //REVIEW - next
    next()//! some have dote to this    
}

module.exports = identifyUser