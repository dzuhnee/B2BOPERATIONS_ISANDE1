import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDW8iUGOIIi6kUID5CIPywByVkQpZku_Mw",
  authDomain: "b2b-operations.firebaseapp.com",
  projectId: "b2b-operations",
  storageBucket: "b2b-operations.firebasestorage.app",
  messagingSenderId: "88299555198",
  appId: "1:88299555198:web:0f39071547c751e5944b2f",
  measurementId: "G-QDY274FP56"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);