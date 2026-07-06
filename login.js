import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLMgpqiXGxmbiTCrN7v-ukyd52BSwxihI",
  authDomain: "telegolub-app.firebaseapp.com",
  projectId: "telegolub-app",
  storageBucket: "telegolub-app.firebasestorage.app",
  messagingSenderId: "153463660671",
  appId: "1:153463660671:web:1240cb7686be79dcf21f4a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Аккаунт создан!");
    location.href = "index.html";
  } catch (e) {
    alert(e.message);
  }
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    location.href = "index.html";
  } catch (e) {
    alert("Неверная почта или пароль");
  }
};
