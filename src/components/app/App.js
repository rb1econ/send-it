import React, { useState } from "react";
import "./App.css";

import { Messaging } from "../messaging/Messaging";

function App() {
  const userOptions = [
    { username: "User One", id: "staticId1" },
    { username: "User Two", id: "staticId2" },
    { username: "User Three", id: "staticId3" }
  ];
  const [userRecipient, setUserRecipient] = useState({});

  function selectUser(id) {
    return function() {
      setUserRecipient({
        ...userRecipient,
        user: userOptions.find(u => id === u.id)
      });
    };
  }

  function selectRecipient(id) {
    return function() {
      setUserRecipient({
        ...userRecipient,
        recipient: userOptions.find(u => id === u.id)
      });
    };
  }

  function displayUserButtons() {
    return userOptions.map(user => {
      return (
        <button
          data-testid="user-button"
          key={user.id}
          onClick={selectUser(user.id)}
        >{`${user.username}`}</button>
      );
    });
  }
  function displayRecipientButtons(userId) {
    return userOptions
      .filter(u => u.id !== userId)
      .map(user => {
        return (
          <button
            data-testid="recipient-button"
            key={user.id}
            onClick={selectRecipient(user.id)}
          >{`${user.username}`}</button>
        );
      });
  }
  return (
    <div className="App">
      <h1>Send It</h1>
      <p>a very, very simple messaging app</p>
      <div>
        {userRecipient.user ? (
          userRecipient.recipient ? (
            <div>
              <Messaging data-testid="messaging-component" {...userRecipient} />
              <div style={{ marginLeft: "-500px", marginBottom: "100px" }}>
                <p>Select a Different Recipient</p>
                {displayRecipientButtons(userRecipient.user.id)}
              </div>
            </div>
          ) : (
            <div>
              <h2>Hello {userRecipient.user.username}</h2>
              <p>Select a Recipient</p>
              {displayRecipientButtons(userRecipient.user.id)}
            </div>
          )
        ) : (
          <div data-testid="select-user">
            <p>Select a user:</p>
            {displayUserButtons()}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
// <script src="/__/firebase/7.5.0/firebase-app.js"></script>
//
// <script src="/__/firebase/7.5.0/firebase-analytics.js"></script>
//
// <script src="/__/firebase/init.js"></script>
