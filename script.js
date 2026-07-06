import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const messages = document.getElementById("messages");
const input = document.getElementById("message");

window.sendMessage = async function () {
  if (input.value.trim() === "") return;

  await addDoc(collection(db, "messages"), {
    text: input.value,
    time: serverTimestamp()
  });

  input.value = "";
};

const q = query(collection(db, "messages"), orderBy("time"));

onSnapshot(q, (snapshot) => {
  messages.innerHTML = "";

  snapshot.forEach((doc) => {
    messages.innerHTML += `<p>${doc.data().text}</p>`;
  });

  messages.scrollTop = messages.scrollHeight;
});
