// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMIYb5mt_aFCxWuJtN5slJi67H_3E8mIs",
  authDomain: "room-reservation-system-demooo.firebaseapp.com",
  projectId: "room-reservation-system-demooo",
  storageBucket: "room-reservation-system-demooo.firebasestorage.app",
  messagingSenderId: "804014151337",
  appId: "1:804014151337:web:e14d41d84ba69b45cebbb8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
