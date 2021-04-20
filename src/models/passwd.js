const { model, Schema } = require("mongoose");

const crypto = require("crypto");
const algorithm = "aes-256-ctr";
const secretKey = process.env.secretkey;
const iv = crypto.randomBytes(16)

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return JSON.stringify({
        iv: iv.toString("hex"),
        content: encrypted.toString("hex"),
    });
};

const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        refs: "User"
    }
})

schema.pre('save', function (next) {
    const user = this

    console.log('rich upper ')
    if (user.isModified('password')) {
        console.log(secretKey)
        user.password = Buffer.from(encrypt(user.password)).toString('base64')
        console.log('rich last')
    }
    next()
})


const Passwd = model('Passwd', schema)


module.exports = Passwd