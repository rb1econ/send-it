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

const db = firebaseApp.firestore();

export { db };
