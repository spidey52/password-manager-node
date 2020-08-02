const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 3000
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/password-manager'

// cors
app.use(cors())

app.use(express.json())

// mongoose connection
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('database connected')
})

// routers 
const userRouter = require('./router/user')
const passwdRouter = require('./router/passwd')



app.use('/users', userRouter)
app.use('/passwds', passwdRouter)


app.listen(port, () => {
    console.log('Everythng is fine, you are doing good job bro.')
    console.log(`server is running on http://localhost:${port}`)
})


