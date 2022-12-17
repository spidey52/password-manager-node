const { Router } = require("express");
const Passwd = require("../models/passwd");
const isAuthenticated = require("../middleware/isauth");
const router = new Router();
const crypto = require("crypto");

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
  passwd.clicks = passwd.clicks + 1;
  await passwd.save();
  res.send("done");
 } catch (error) {
  res.status(500).send({ error: error.message });
 }
});

function decryptPass(password) {
 console.log("reach here");

 const epass = Buffer.from(password, "base64").toString("ascii");
 console.log(epass);
 const pass = JSON.parse(epass);

 const algorithm = "aes-256-ctr";
 const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";

 const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
   algorithm,
   secretKey,
   Buffer.from(hash.iv, "hex")
  );

  const decrpyted = Buffer.concat([
   decipher.update(Buffer.from(hash.content, "hex")),
   decipher.final(),
  ]);

  return decrpyted.toString();
 };

 return decrypt(pass);
}

router.get("/copy", isAuthenticated, async (req, res) => {
 try {
  const pass = req.headers.pass;
  if (!pass) return res.status(400).send("no password found");

  return res.send(decryptPass(pass));
 } catch (error) {
  console.log(error);
  return res.status(500).send("something went wrong");
 }
});

// router.get("/",  async (req, res) => {
router.get("/", isAuthenticated, async (req, res) => {
 try {
  // await req.user.getAllPasswords().sort(['clicks',]);
  const passwds = await Passwd.find({ owner: req.user._id }).sort([
   ["clicks", -1],
  ]);
  return res.send(passwds);
 } catch (e) {
  console.log(e.message);
  res.status(500).send({ error: "unable to get the passwords." });
 }
});

router.get("/:id", async (req, res) => {
 try {
  const data = await Passwd.findById(req.params.id);
  res.end(data);
 } catch (e) {
  res.status(500).send({ error: "unable to get the password." });
 }
});

router.patch("/:id", isAuthenticated, async (req, res) => {
 try {
  const passwd = await Passwd.findById(req.params.id);
  console.log(req.body, 'line 95');
  const { password, username, email } = req.body;

  if (password) passwd.password = password;
  passwd.username = username;
  passwd.email = email;

  await passwd.save();

  res.send({ msg: true });
 } catch (e) {
  console.log(e);
  res.status(500).send({ error: e.messge });
 }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
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
