importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDTZmf6bDlgvhW712YYpXcsuYmi0TvfHNk",
  authDomain: "yatranow-5b122.firebaseapp.com",
  projectId: "yatranow-5b122",
  storageBucket: "yatranow-5b122.appspot.com",
  messagingSenderId: "314508074395",
  appId: "1:314508074395:web:46e551b8b5bb1deb3d553e",
  measurementId: "G-J1KBJGK1MV"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo192.png'
  });
});