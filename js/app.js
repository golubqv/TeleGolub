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

  const text = input.value.trim();

  if (text === "") return;

  await addDoc(collection(db, "messages"), {
    text: text,
    sender: "Me",
    time: serverTimestamp()
  });

  input.value = "";

};

const q = query(
  collection(db, "messages"),
  orderBy("time")
);

onSnapshot(q, (snapshot) => {

  messages.innerHTML = "";

  snapshot.forEach((doc) => {

    const data = doc.data();

    const div = document.createElement("div");

    div.className = "message me";

    div.innerHTML = `
      <div>${data.text}</div>
    `;

    messages.appendChild(div);

  });

  messages.scrollTop = messages.scrollHeight;

});
