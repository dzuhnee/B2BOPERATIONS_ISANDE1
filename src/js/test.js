import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

try {
  const docRef = await addDoc(collection(db, "test"), {
    message: "Hello Firebase",
    createdAt: new Date()
  });
  console.log("Saved! ID:", docRef.id);
} catch (e) {
  console.error("Error:", e);
}