import { auth } from "./firebase.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

window.logout = async function () {

    const ok = confirm("Выйти из аккаунта?");

    if (!ok) return;

    try {

        await signOut(auth);

        location.href = "login.html";

    } catch (e) {

        console.error(e);

        alert("Ошибка при выходе.");

    }

}
