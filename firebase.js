// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTTcfPbyRYQvN60X_8AGu0s_BfXdhhAk4",
  authDomain: "room-reservation-system-cists.firebaseapp.com",
  projectId: "room-reservation-system-cists",
  storageBucket: "room-reservation-system-cists.firebasestorage.app",
  messagingSenderId: "79407752626",
  appId: "1:79407752626:web:4fae089f7a876d0e1c70ab"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);