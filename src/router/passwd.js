const { Router } = require("express");
const Passwd = require("../models/passwd");
const isAuthenticated = require("../middleware/isauth");
const router = new Router();

const { promisify } = require("util");

router.post("/", isAuthenticated, async (req, res) => {
  const passwd = new Passwd({ ...req.body, owner: req.user._id });

  try {
    await passwd.save();
    const passes = await req.user.getAllPasswords();

    await setPasswordToRedis(req.user.username, passes.passwds);

    res.status(201).send({ passwd });
  } catch (error) {
    res.status(500).send({ error });
  }
});

const redis = require("redis");
const client = redis.createClient();

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

let count = 0;
router.get("/", isAuthenticated, async (req, res) => {
  try {
    // let passes = await GET_ASYNC(`${req.user.username}-passes`);
    // if (passes) {
    //   console.log("from here ", count);
    //   res.send(JSON.parse(passes));
    //   return;
    // }
    passes = await req.user.getAllPasswords();
    // await setPasswordToRedis(req.user.username, passes.passwds);

    // console.log(passes.passwds);

    // setTimeout(() => {
    //   res.send(passes.passwds);
    // }, 1000)

    res.send(passes.passwds);
    console.log("reach here ", count);
    count++;
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "unable to get the passwords." });
  }
});

// TODO: set it later
// router.get('/:name', (req, res) => {
//     res.send('passwor by name.')
// })

router.patch("/", isAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    const { password, name, email, username } = req.body;
    await Passwd.findByIdAndUpdate(req.body._id, {
      password,
      name,
      email,
      username,
    });
    res.send({msg: true});
  } catch (e) {
    res.status(500).send({ error: "unable to update." });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    await Passwd.findByIdAndDelete(req.params.id);

    const passes = await req.user.getAllPasswords();

    await setPasswordToRedis(req.user.username, passes.passwds);

    res.send({ msg: true });
  } catch (e) {
    res.status(500).send({ error: "unable to find password" });
  }
});

module.exports = router;

async function setPasswordToRedis(username, passes) {
  console.log(username);
  await SET_ASYNC(`${username}-passes`, JSON.stringify(passes));
}
