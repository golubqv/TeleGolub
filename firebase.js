import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLMgpqiXGxmbiTCrN7v-ukyd52BSwxihI",
  authDomain: "telegolub-app.firebaseapp.com",
  projectId: "telegolub-app",
  storageBucket: "telegolub-app.firebasestorage.app",
  messagingSenderId: "153463660671",
  appId: "1:153463660671:web:1240cb7686be79dcf21f4a"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
