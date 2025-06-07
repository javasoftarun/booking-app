import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDTZmf6bDlgvhW712YYpXcsuYmi0TvfHNk",
  authDomain: "yatranow-5b122.firebaseapp.com",
  projectId: "yatranow-5b122",
  storageBucket: "yatranow-5b122.appspot.com",
  messagingSenderId: "314508074395",
  appId: "1:314508074395:web:46e551b8b5bb1deb3d553e",
  measurementId: "G-J1KBJGK1MV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const messaging = getMessaging(app);

export { auth, provider, signInWithPopup, messaging, getToken, onMessage };