const jwt = require("jsonwebtoken")
const User = require('../models/user')
const { disconnect } = require("mongoose")

module.exports = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        // TODO: first get user, then verify token, according to that send msg.

        if (!user) {
            return res.status(404).send({ error: "no user found" })
        }

        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({ error })
    }
}


