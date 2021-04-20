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

// router.get("/",  async (req, res) => {
router.get("/", isAuthenticated, async (req, res) => {
  try {
    await req.user.getAllPasswords();
    res.send(req.user.passwds);
  } catch (e) {
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
