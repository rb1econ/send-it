import firebase from "firebase";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "send-it-2a416.firebaseapp.com",
  databaseURL: "https://send-it-2a416.firebaseio.com",
  projectId: "send-it-2a416",
  storageBucket: "send-it-2a416.appspot.com",
  messagingSenderId: "833745131334",
  appId: "1:833745131334:web:00d929182949a751337747",
  measurementId: "G-J343JLWGGP"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();
// messaging.getToken({vapidKey: "BBh0bh7oFM02Dfa8pfHZ3VQdP6qPOK5bUnMVl69Lj68qHEFd5oga3VcCht-npfUztuWw9l_KPl74Q7b1Vqj-on8"}).then((currentToken) => {
//   console.log('HERE::::::::::::::::::')
//   if (currentToken) {
//     firebase.sendTokenToServer(currentToken);
//     // firebase.updateUIForPushEnabled(currentToken);
//   } else {
//     // Show permission request.
//     console.log('No registration token available. Request permission to generate one.');
//     // Show permission UI.
//     // firebase.updateUIForPushPermissionRequired();
//     // firebase.setTokenSentToServer(false);
//   }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     firebase.showToken('Error retrieving registration token. ', err);
//     // firebase.setTokenSentToServer(false);
// });
const db = firebaseApp.firestore();

export { db };
