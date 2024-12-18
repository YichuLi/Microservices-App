const express = require("express"); // a Node.js framework used for building web applications and APIs
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body; // Extract the title from the request body

  posts[id] = {
    id,
    title,
  };
  // await pauses the execution of the function until the promise is resolved
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]); // Respond with the newly created post
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type); // Log the type of event received
  res.send({ status: "OK" }); // Respond to the event
});

// starts the server on port 4000
app.listen(4000, () => {
  console.log("Listening on 4000");
});
