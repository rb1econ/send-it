import React, { useState } from "react";
import "./App.css";
import firebase from 'firebase'
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
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
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
  // [START get_messaging_object]
  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();
  // [END get_messaging_object]

  // IDs of divs that display registration token UI or request permission UI.
  const tokenDivId = 'token_div';
  const permissionDivId = 'permission_div';

  // [START receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // [START_EXCLUDE]
    // Update the UI to include the received message.
    appendMessage(payload);
    // [END_EXCLUDE]
  });
  // [END receive_message]

  function resetUI() {
    clearMessages();
    showToken('loading...');
    // [START get_token]
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken({vapidKey: 'BBh0bh7oFM02Dfa8pfHZ3VQdP6qPOK5bUnMVl69Lj68qHEFd5oga3VcCht-npfUztuWw9l_KPl74Q7b1Vqj-on8'}).then((currentToken) => {
      if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No registration token available. Request permission to generate one.');
        // Show permission UI.
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      showToken('Error retrieving registration token. ');
      setTokenSentToServer(false);
    });
    // [END get_token]
  }


  function showToken(currentToken) {
    // Show token in console and UI.
    const tokenElement = document.querySelector('#token');
    if (tokenElement) tokenElement.textContent = currentToken;
  }

  // Send the registration token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      setTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }

  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
  }

  function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
  }

  function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
      div.style = 'display: visible';
    } else {
      div.style = 'display: none';
    }
  }

  function requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve a registration token for use with FCM.
        // [START_EXCLUDE]
        // In many cases once an app has been granted notification permission,
        // it should update its UI reflecting this.
        resetUI();
        // [END_EXCLUDE]
      } else {
        console.log('Unable to get permission to notify.');
      }
    });
    // [END request_permission]
  }

  function deleteToken() {
    // Delete registration token.
    // [START delete_token]
    messaging.getToken().then((currentToken) => {
      messaging.deleteToken(currentToken).then(() => {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        resetUI();
        // [END_EXCLUDE]
      }).catch((err) => {
        console.log('Unable to delete token. ', err);
      });
      // [END delete_token]
    }).catch((err) => {
      console.log('Error retrieving registration token. ', err);
      showToken('Error retrieving registration token. ');
    });
  }

  // Add a message to the messages element.
  function appendMessage(payload) {
    console.log('appendMessage CALLED::', payload);
    const messagesElement = document.querySelector('#messages');
    const dataHeaderElement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;';
    dataHeaderElement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderElement);
    messagesElement.appendChild(dataElement);
  }

  // Clear the messages element of all children.
  function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement && messagesElement.hasChildNodes()) {
      messagesElement.removeChild(messagesElement.lastChild);
    }
  }

  function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
  }

  function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
  }

  resetUI();
  return (
    <div className="App">
      <h1>Send It</h1>
      <p>a very, very simple messaging app</p>
      <main className="mdl-layout__content mdl-color--grey-100">
        <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">

          <div className="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
            <div className="mdl-card__supporting-text mdl-color-text--grey-600">
              {/* <!-- div to display the generated registration token --> */}
              <div id="token_div" style={{display: "none"}}>
                <h4>Registration Token</h4>
                <p id="token" style={{wordBreak: "break-all"}}></p>
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                        onClick={deleteToken}>Delete Token</button>
              </div>
              {/* <!-- div to display the UI to allow the request for permission to
                  notify the user. This is shown if the app has not yet been
                  granted permission to notify. --> */}
              <div id="permission_div" style={{display: "none"}}>
                <h4>Needs Permission</h4>
                <p id="token"></p>
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                        onClick={requestPermission}>Request Permission</button>
              </div>
              {/* <!-- div to display messages received by this app. --> */}
              <div id="messages"></div>
            </div>
          </div>

        </div>
      </main>
      <div>
        {userRecipient.user ? (
          userRecipient.recipient ? (
            <div>
              <Messaging data-testid="messaging-component" {...userRecipient} />
              <div style={{ marginBottom: "100px" }}>
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
