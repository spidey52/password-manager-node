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

router.get("/", isAuthenticated, async (req, res) => {
  try {
    await req.user.getAllPasswords();
    res.send(req.user.passwds);
  } catch (e) {
    res.status(500).send({ error: "unable to get the passwords." });
  }
});

// router.get('/:name', (req, res) => {
//     res.send('passwor by name.')
// })

router.patch("/", async (req, res) => {
  try {
    console.log(req.body);
    const passwd = await Passwd.findByIdAndUpdate(req.body._id, {
      password: req.body.password,
    });
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
