import React from "react";
import { MessageDisplay } from "./MessageDisplay";
// React.memo
const MessageContainer = ({ messageData, user }) => {
  return (
    <ul>
      {messageData.messages.length
        ? messageData.messages.map(message => (
            <MessageDisplay key={message.id} {...{ message, user }} />
          ))
        : null}
    </ul>
  );
};

export { MessageContainer };
