const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express(); // Create an express application
app.use(bodyParser.json()); // Parse the body of incoming requests as JSON

app.post("/events", (req, res) => {
  const event = req.body;

  // Send the event to posts, comments, and query services
  axios.post("http://localhost:4000/events", event).catch((err) => {
    // Send the event to posts service
    console.log(err.message);
  });
  axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4003/events", event).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
