import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  currentUser = user;
});

window.saveProfile = async function () {

  const name = document.getElementById("name").value.trim();
  let username = document.getElementById("username").value.trim().toLowerCase();

  if (!name || !username) {
    alert("Заполните все поля");
    return;
  }

  username = username.replace("@", "");

  // Проверяем, занят ли username
  const usernameDoc = await getDoc(doc(db, "usernames", username));

  if (usernameDoc.exists()) {
    alert("❌ Этот username уже занят");
    return;
  }

  // Сохраняем профиль
  await setDoc(doc(db, "users", currentUser.uid), {
    name,
    username,
    email: currentUser.email,
    pro: false,
    createdAt: serverTimestamp()
  });

  // Бронируем username
  await setDoc(doc(db, "usernames", username), {
    uid: currentUser.uid
  });

  alert("Профиль создан!");

  location.href = "index.html";

};
