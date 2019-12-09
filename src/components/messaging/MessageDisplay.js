import React from "react";

function MessageDisplay({ message, user }) {
  const style = {
    color: user.id === message.userId ? "green" : "white"
  };
  return (
    <li data-testid="message-li" style={style}>{`${
      message.text
    } at ${message.createdAt.toLocaleTimeString()} on ${message.createdAt.toLocaleDateString()}`}</li>
  );
}

export { MessageDisplay };
