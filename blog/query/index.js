const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

// Receive events from the event bus
app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
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
    const comment = post.comments.find((comment) => {
      // return comment.id === id means that the comment id is equal to the id passed in the request
      return comment.id === id;
    });

    // Update the status and content of the comment
    comment.status = status;
    comment.content = content;
  }

  console.log(posts);
  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
