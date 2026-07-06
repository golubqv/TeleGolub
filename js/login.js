import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

window.register = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Заполните все поля");
    return;
  }

  try {

    await createUserWithEmailAndPassword(auth, email, password);

    location.href = "setup.html";

  } catch (e) {

    alert(e.message);

  }

}

window.login = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Заполните все поля");
    return;
  }

  try {

    await signInWithEmailAndPassword(auth, email, password);

    location.href = "index.html";

  } catch (e) {

    alert("Неверный email или пароль");

  }

}
