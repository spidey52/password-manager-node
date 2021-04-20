const { Router } = require("express")
const User = require('../models/user')
const isAuthenticated = require('../middleware/isauth')

const router = new Router()

router.get('/checkusername/:username', async (req, res) => {
    try {
        console.log(req.params.username)
        const user = await User.findOne({ username: req.params.username })
        if (!user) {
            return res.send({ msg: true })
        }
        return res.send({ msg: false })
    }
    catch (e) {
        console.log(e)
        return e
    }
})

router.post('/', async (req, res) => {
    const user = new User(req.body)
    console.log(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken(req.body.email, req.body.password)
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        console.log('reach error')
        res.status(400).send({ error: error.message })
    }
})

router.post('/logout', isAuthenticated, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send({ msg: "succesfully logout" })
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/logoutAll', isAuthenticated, async (req, res,) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send({ msg: "logout from all sessions" })
    }
    catch (error) {
        res.status(500).send()
    }
})

router.get('/me', isAuthenticated, async (req, res) => {
    res.send(req.user)
})

//  TODO: it will use later
// router.get('/:username', isAuthenticated, async (req, res) => {
//     try {
//         const user = await User.findOne({ username: req.params.username },)
//         if (!user) {
//             return res.status(404).send({ error: "user not found." })
//         }
//         res.send({ user })
//     } catch (error) {
//         res.status(400).send({ error })
//     }
// })

router.patch('/', isAuthenticated, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'lastName', 'password', 'email']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: {
                msg: "allowed updates are: ",
                allowedUpdates
            }
        })
    }

    const user = req.user
    try {

        updates.forEach(update => user[update] = req.body[update])
        await user.save()

        res.send(user)
    } catch (error) {
        res.status(404).send({ error })
    }
})

router.delete('/me', isAuthenticated, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send({ user: req.user })
    } catch (error) {
        res.status(400).send({ error })
    }

    res.send(`profile of ${req.params.username} is deleted.`)
})


module.exports = router
