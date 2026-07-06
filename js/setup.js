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

    if (!currentUser) {
        alert("Пользователь не найден.");
        return;
    }

    const name = document.getElementById("name").value.trim();

    let username = document.getElementById("username").value
        .trim()
        .toLowerCase()
        .replace("@", "");

    const bio = document.getElementById("bio").value.trim();

    if (name === "" || username === "") {
        alert("Заполните имя и username.");
        return;
    }

    const usernameRef = doc(db, "usernames", username);

    const usernameSnap = await getDoc(usernameRef);

    if (usernameSnap.exists()) {
        alert("Этот @username уже занят.");
        return;
    }

    await setDoc(doc(db, "users", currentUser.uid), {

        uid: currentUser.uid,

        email: currentUser.email,

        name: name,

        username: username,

        bio: bio,

        avatar: "",

        pro: false,

        verified: false,

        createdAt: serverTimestamp()

    });

    await setDoc(usernameRef, {
        uid: currentUser.uid
    });

    location.href = "index.html";

};
