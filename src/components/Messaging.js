import React, { useEffect, useState } from "react";
import shortid from "shortid";
import messagesDAO from "../dao/messagesDAO.js";
import { MessageContainer } from "./MessageContainer";
import { db } from "../firebase.js";

const MESSAGES_COLLECTION = "messages";

function Messaging({ user, recipient }) {
  const [currentText, setCurrentText] = useState("");
  const [messageData, setMessages] = useState({ messages: [] });

  // this useEffect hook serves as componentDidMount and componentDidUpdate
  useEffect(() => {
    const messages$ = messagesDAO.loadMessages(user.id, recipient.id);
    const subscription = messages$.subscribe(messages => {
      const flattenedArray = []
        .concat(...messages)
        .map(m => {
          if (!(m.createdAt instanceof Date)) {
            m.createdAt = m.createdAt.toDate();
          }
          return m;
        })
        .sort((a, b) => a.createdAt - b.createdAt);
      setMessages({ messages: flattenedArray });
    });
    return function cleanUp() {
      subscription.unsubscribe();
    };
  }, [user.id, recipient.id]);

  const sendIt = async function(e) {
    e.preventDefault();
    if (!currentText) return;
    const currentMessage = {
      text: currentText,
      createdAt: new Date(),
      id: shortid.generate(),
      userId: user.id,
      recipientId: recipient.id
    };
    try {
      await messagesDAO.add(currentMessage);
      setCurrentText("");
    } catch (err) {
      console.log("err saving new message", err);
      //TODO handle this in UI
    }
  };
  const handleCurrentText = function(e) {
    setCurrentText(e.target.value);
  };
  return (
    <div>
      <MessageContainer {...{ messageData, user }} />

      <form>
        <label>
          <p>Your New Message Here:</p>
          <input
            value={currentText}
            onChange={handleCurrentText}
            name="current-message"
          />
        </label>
        <button
          data-testid="send-it"
          type="submit"
          onClick={sendIt}
          disabled={!currentText}
        >
          SEND IT
        </button>
      </form>
    </div>
  );
}

export { Messaging };
