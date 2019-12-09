import React, { useState } from "react";
import shortid from "shortid";
import logo from "../../logo.svg";
import "./App.css";

import { db } from "../../firebase.js";

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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {userRecipient.user ? (
          userRecipient.recipient ? (
            <>
              <Messaging data-testid="messaging-component" {...userRecipient} />
              <div>
                <p>Select a Different Recipient</p>
                {displayRecipientButtons(userRecipient.user.id)}
              </div>
            </>
          ) : (
            <div>
              <h2>Hello {userRecipient.user.username}</h2>
              <p>Select a Recipient</p>
              {displayRecipientButtons(userRecipient.user.id)}
            </div>
          )
        ) : (
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: 500,
              height: 500
            }}
            data-testid="select-user"
          >
            <p>Select a user:</p>
            {displayUserButtons()}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
// <script src="/__/firebase/7.5.0/firebase-app.js"></script>
//
// <script src="/__/firebase/7.5.0/firebase-analytics.js"></script>
//
// <script src="/__/firebase/init.js"></script>