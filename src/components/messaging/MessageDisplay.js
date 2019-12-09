import React from "react";

function MessageDisplay({ message, user }) {
  const style = {
    backgroundColor: user.id === message.userId ? "#09d3ac" : "#ffffff",
    marginRight: user.id === message.userId ? 0 : "40px",
    marginLeft: user.id === message.userId ? "40px" : 0,
    listStyleType: "none",
    marginBottom: "10px",
    padding: "5px",
    borderRadius: "10px",
    color: "#282c34"
  };
  const dateStyle = {
    fontSize: "15px"
  };
  return (
    <li data-testid="message-li" style={style}>
      {`${message.text}`}
      <div style={dateStyle}>
        {`at ${message.createdAt.toLocaleTimeString()} on ${message.createdAt.toLocaleDateString()}`}
      </div>
    </li>
  );
}

export { MessageDisplay };
