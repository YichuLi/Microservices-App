const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

// Get all comments for a post by post ID
app.get("/posts/:id/comments", (req, res) => {
  // :id is a wildcard that can be anything that comes after /posts/ in the URL
  res.send(commentsByPostId[req.params.id] || []);
});

// Create a new comment for a post by post ID
app.post("/posts/:id/comments", async (req, res) => {
  // async keyword is used to define an asynchronous function, which returns a promise
  const commentId = randomBytes(4).toString("hex"); // promise is an object representing the eventual completion or failure of an asynchronous operation
  const { content } = req.body; // req.body is the data that is sent to the server in the request body, which is parsed as JSON.
  // {} is object destructuring syntax in JavaScript that allows you to extract data from objects and arrays

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  // Send the event to the event bus
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);

  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { postId, id, status, content } = data; // Extract the postId, id, and status from the data object

    const comments = commentsByPostId[postId];

    // Find the comment with the given id and update its status.
    // comment is a variable that stores the comment object with the given id
    // comments is an array of comments for the given postId
    // find() is a method that returns the first element in the array that satisfies the condition
    // The condition is that the comment id is equal to the id passed in the request
    // comment => is an arrow function that takes a comment as an argument and returns whether the comment id is equal to the id
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    // Send the event to the event bus
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
