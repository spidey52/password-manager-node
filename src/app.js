const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 5000
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
db.on('error', (err) => {
    console.log(err.message)
} )
db.once('open', function () {
    console.log('database connected')
})

// routers 
const resetToken = {}

app.get('/', (req, res) => {
    const dateTime = new Date().toLocaleString()
    return res.send(`${dateTime} ok`);
})

const userRouter = require('./router/user')
const passwdRouter = require('./router/passwd')
const tickerRouter = require('./router/ticker')
const User = require('./models/user')
const sendMail = require("./middleware/sendMail")


app.use('/users', userRouter)
app.use('/passwds', passwdRouter)
app.use("/tickers", tickerRouter)

app.get("/reset-password", async (req, res) => {

    try {
        const { email } = req.query
        if (!email) return res.status(404).send("email not found")
        const user = await User.findOne({ email: email })
        if (!user) return res.status(404).send("no user found")
        const token = Math.floor(Math.random() * 100000 + 1)
        resetToken[email] = token
        sendMail(email, "reset password", "hello", `your otp for reset password is ${token}`)
        setTimeout(() => {
            delete resetToken[email]
        }, 1000 * 60 * 5)
        return res.send(`${token}`)
    } catch (error) {
        console.log(error)
        return res.status(500).send("something went wrong")
    }

})

app.post("/reset-password", async (req, res) => {
    const { email, otp, newPassword } = req.body
    const user = await User.findOne({ email: email })
    if (!user) return res.send("no user found")

    if (!otp) return res.status(400).send("token not found")
    if (!resetToken[email]) return res.status(400).send("token expired")
    if (parseInt(otp) !== parseInt(resetToken[email])) return res.status(400).send("otp is invalid")

    user.password = newPassword
    await user.save()
    delete resetToken[email]
    const token = await user.generateAuthToken(email, newPassword)
    res.status(200).send({ user, token })
})

app.listen(port, () => {
    console.log('Everythng is fine, you are doing good job bro.')
    console.log(`server is running on http://localhost:${port}`)
})

