const { Router } = require("express");
const Passwd = require("../models/passwd");
const isAuthenticated = require("../middleware/isauth");
const router = new Router();

router.post("/", isAuthenticated, async (req, res) => {
  const passwd = new Passwd({ ...req.body, owner: req.user._id });

  try {
    await passwd.save();
    res.status(201).send({ passwd });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.get("/:id/clicks", isAuthenticated, async (req, res) => {
  try {
    const passwd = await Passwd.findById(req.params.id);
    passwd.clicks = passwd.clicks + 1
    await passwd.save()
    res.send("done");
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// router.get("/",  async (req, res) => {
router.get("/", isAuthenticated, async (req, res) => {
  try {
    // await req.user.getAllPasswords().sort(['clicks',]);
    const passwds = await Passwd.find({ owner: req.user._id }).sort([['clicks', -1]])
    return res.send(passwds);
  } catch (e) {
    console.log(e.message)
    res.status(500).send({ error: "unable to get the passwords." });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await Passwd.findById(req.params.id)
    res.end(data)
  } catch (e) {
    res.status(500).send({ error: 'unable to get the password.' });
  }
})

router.patch("/", async (req, res) => {
  try {
    const passwd = await Passwd.findById(req.body._id)

    passwd.password = req.body.password,
      passwd.username = req.body.username,
      passwd.email = req.body.email

    await passwd.save()
    console.log('rich here')

    res.send({ msg: true });
  } catch (e) {
    res.status(500).send({ error: "unable to update." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const passwd = await Passwd.findByIdAndDelete(req.params.id);
    res.send({ msg: true });
  } catch (e) {
    res.status(500).send({ error: "unable to find password" });
  }
});

module.exports = router;

// async function resetClicks() {
//   const result = await Passwd.updateMany({}, {clicks: 0})
//   console.log(result)
// }