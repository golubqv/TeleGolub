import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

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

// Проверяем авторизацию
onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  loadMessages();
});

// Отправка сообщения
window.sendMessage = async function () {
  if (input.value.trim() === "") return;

  await addDoc(collection(db, "messages"), {
    text: input.value,
    user: auth.currentUser.email,
    time: serverTimestamp()
  });

  input.value = "";
};

// Загрузка сообщений
function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("time"));

  onSnapshot(q, (snapshot) => {
    messages.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();

      messages.innerHTML += `
        <p>
          <b>${data.user}</b><br>
          ${data.text}
        </p>
      `;
    });

    messages.scrollTop = messages.scrollHeight;
  });
}
