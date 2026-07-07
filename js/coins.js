import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.updateCoins = async function () {

    if (!auth.currentUser) return;

    const snap = await getDoc(
        doc(db, "users", auth.currentUser.uid)
    );

    if (!snap.exists()) return;

    const coins = snap.data().coins || 0;

    const el = document.getElementById("coins");

    if (el) {

        el.textContent = coins;

    }

}

window.addCoins = async function(amount){

    await updateDoc(
        doc(db,"users",auth.currentUser.uid),
        {
            coins:increment(amount)
        }
    );

    updateCoins();

}

window.removeCoins = async function(amount){

    await updateDoc(
        doc(db,"users",auth.currentUser.uid),
        {
            coins:increment(-amount)
        }
    );

    updateCoins();

}
