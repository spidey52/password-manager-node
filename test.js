const axios = require("axios");

let count = 0;
setInterval(async () => {
  await getData();
  console.log(count++);
}, 10);

async function getData() {
  try {
    await axios.get("http://localhost:4000/passwds", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDAxNjQ4MzFmNTI3YzQ0NGMwNDhiYjAiLCJpYXQiOjE2MTA3NzIxMjB9.WzAJD-1oMmPg-UBq4Aqs6qfIE3I4bYVA6m8SMWrMhlk`,
      },
    });
  } catch (err) {
    console.log(err);
  }
}
