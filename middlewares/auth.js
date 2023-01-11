const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticate = async (req, res, next) => {

    try {
        const token = req.cookies.authToken
        const verify = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: verify._id, token: req.cookies.authToken })

        if (!user) return res.send("USER NOT FOUND")

        req.token = token
        req.user = user
        req.userId = req.user._id

        next()
    }
    catch (err) {

        console.log(err)
        return res.send("USER NOT FOUND")
    }
}

module.exports = authenticate