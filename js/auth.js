import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const username = document.getElementById("username");

    if (username) {
        username.textContent = user.email;
    }

});

window.logout = async function () {

    await signOut(auth);

    window.location.href = "login.html";

}
