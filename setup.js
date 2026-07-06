import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "login.html";
  }
});

window.saveProfile = async function () {

  const user = auth.currentUser;

  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();

  if (name === "" || username === "") {
    alert("Заполните все поля");
    return;
  }

  await setDoc(doc(db, "users", user.uid), {
    name: name,
    username: username,
    email: user.email,
    pro: false,
    createdAt: serverTimestamp()
  });

  location.href = "index.html";

};
