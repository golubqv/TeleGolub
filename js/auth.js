import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.currentUserData = data;
if(window.updateCoins){

    window.updateCoins();

}

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    const snap = await getDoc(
        doc(db, "users", user.uid)
    );

    if (!snap.exists()) {

        location.href = "setup.html";

        return;

    }

    const data = snap.data();

    window.currentUserData = data;

    const username = document.getElementById("username");

    if (username) {

        username.textContent = data.name;

    }

});

window.logout = async function () {

    await signOut(auth);

    location.href = "login.html";

}
