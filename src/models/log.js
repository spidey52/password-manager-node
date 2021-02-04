const mongoose = require('mongoose')


const Log = mongoose.model('Log', mongoose.Schema({ title: String }))

module.exports = Log

