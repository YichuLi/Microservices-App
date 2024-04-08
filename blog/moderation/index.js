const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Create an array to store the events that are sent to the moderation service
app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    // Check if the comment contains the word "orange", if it does, reject the comment, otherwise approve it
    const status = data.content.includes("orange") ? "rejected" : "approved";
    // Send the event to the event bus with the status of the comment
    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status, // status is either "approved" or "rejected", the reason thereis no ':' is because the key and value are the same, so it is a shorthand. Or it could be written as status: status
        content: data.content,
      },
    });
  }
  // Send a response to the event bus to acknowledge that the event was received, the message is not important
  res.send({});
});

// Listen on port 4003 for incoming events
app.listen(4003, () => {
  console.log("Listening on 4003");
});
