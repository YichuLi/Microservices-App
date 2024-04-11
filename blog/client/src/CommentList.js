import React from "react";

// comments is an array of objects from the CommentList component, which is passed as a prop to this component
const CommentList = ({ comments }) => {
  // map over the comments array and return a list element for each comment
  const renderedComments = comments.map((comment) => {
    let content;

    if (comment.status === "approved") {
      content = comment.content;
    }

    if (comment.status === "pending") {
      content = "This comment is awaiting moderation";
    }

    if (comment.status === "rejected") {
      content = "This comment has been rejected";
    }
    // comment
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
