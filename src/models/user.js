const { model, Schema } = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        minlength: 6,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

schema.virtual('passwds', {
    ref: 'Passwd',
    localField: "_id",
    foreignField: "owner"
})


schema.methods.getAllPasswords = async function () {
    const user = this
    const passwds = await user.populate('passwds').execPopulate()
    return passwds
}

schema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.__v

    return userObject
}

schema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, 'thisismynewcourse',)
    user.tokens = user.tokens.concat({ token })

    await user.save()

    return token
}

schema.statics.findByCredentials = async (email, password) => {
    console.log(this)
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("user doesn't exists.")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        // throw new Error({msg: "password is incorrect"})
        throw new Error("password is incorrect")
    }

    return user
}

schema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = model('User', schema)

module.exports = User