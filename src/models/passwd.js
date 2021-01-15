const { model, Schema} = require("mongoose");


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

const Passwd = model('Passwd', schema)


module.exports = Passwd 