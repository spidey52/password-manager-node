const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/password-manager'

// cors
app.use(cors())

app.use(express.json())

// mongoose connection
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('database connected')
})

// routers 

// setInterval(async () => {
//     try {
//         console.log('start')
//         const { data } = await axios.get(' https://spidey-passmanager.herokuapp.com')
//         console.log(data)
//         await Log.create({ title: data })
//     } catch (error) {
//         console.log(error.message)
//         await Log.create({ title: error.message })
//     }
// }, 1000 * 600)

app.get('/', (req, res) => {
    const dateTime = new Date().toLocaleString()
    return res.send(`${dateTime} ok`);
})

const userRouter = require('./router/user')
const passwdRouter = require('./router/passwd')
const { default: axios } = require('axios')
const Log = require('./models/log')



app.use('/users', userRouter)
app.use('/passwds', passwdRouter)


app.listen(port, () => {
    console.log('Everythng is fine, you are doing good job bro.')
    console.log(`server is running on http://localhost:${port}`)
})

