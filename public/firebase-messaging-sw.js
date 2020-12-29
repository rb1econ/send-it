// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');
// import firebase from 'firebase'


//  Here is is the code snippet to initialize Firebase Messaging in the Service Worker when your app is not hosted on Firebase Hosting.

 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here. Other Firebase libraries
 // are not available in the service worker.
//  importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
//  importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

 // Initialize the Firebase app in the service worker by passing in
 // your app's Firebase config object.
 // https://firebase.google.com/docs/web/setup#config-object
 firebase.initializeApp({
  apiKey: "AIzaSyCvwxLdvQfEdj6Zf78gXJzjR0Yb2r3Vo8I",
  authDomain: "send-it-2a416.firebaseapp.com",
  databaseURL: "https://send-it-2a416.firebaseio.com",
  projectId: "send-it-2a416",
  storageBucket: "send-it-2a416.appspot.com",
  messagingSenderId: "833745131334",
  appId: "1:833745131334:web:00d929182949a751337747",
  measurementId: "G-J343JLWGGP"
});

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 // [END initialize_firebase_in_sw]
// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START on_background_message]
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// [END on_background_message]