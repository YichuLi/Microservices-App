const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    // Extract the id and title from the data that was sent in the request
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    // Find the comment with the id that was passed in the request
    const comment = post.comments.find((comment) => {
      // return comment.id === id means that the comment id is equal to the id passed in the request
      return comment.id === id;
    });

    // Update the status and content of the comment
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

// Receive events from the event bus
app.post("/events", (req, res) => {
  // Extract the type and data from the request body
  const { type, data } = req.body;
  // console.log(posts);
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");

  const res = await axios.get("http://localhost:4005/events");

  // Loop through the events and process each one
  // res.data is an array of objects from the event bus
  // let event of res.data means that for each event in the res.data array, do something
  // event can be named anything, it's just a variable name
  for (let event of res.data) {
    console.log("Processing event:", event.type);

    handleEvent(event.type, event.data);
  }
});
