import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    try {

        const snap = await getDoc(doc(db, "users", user.uid));

        if (!snap.exists()) {
            location.href = "setup.html";
            return;
        }

        const data = snap.data();

        document.getElementById("name").textContent =
            data.name || "Без имени";

        document.getElementById("username").textContent =
            "@" + (data.username || "username");

        document.getElementById("bio").textContent =
            data.bio || "Пользователь пока ничего не рассказал о себе.";

        document.getElementById("coins").textContent =
            data.coins || 0;

        document.getElementById("level").textContent =
            data.level || 1;

        document.getElementById("pro").textContent =
            data.pro ? "PRO" : "Free";

        document.getElementById("avatarLetter").textContent =
            (data.name || "?").charAt(0).toUpperCase();

    } catch (e) {

        console.error(e);
        alert("Не удалось загрузить профиль.");

    }

});
