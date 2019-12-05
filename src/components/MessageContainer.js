import React from "react";
import { MessageDisplay } from "./MessageDisplay";

const MessageContainer = React.memo(({ messageData, user }) => {
  return (
    <ul>
      {messageData.messages.length
        ? messageData.messages.map(message => (
            <MessageDisplay key={message.id} {...{ message, user }} />
          ))
        : null}
    </ul>
  );
});

export { MessageContainer };
