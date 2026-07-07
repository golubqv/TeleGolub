import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.getCoins = async function () {

    const snap = await getDoc(
        doc(db, "users", auth.currentUser.uid)
    );

    if (!snap.exists()) return 0;

    return snap.data().coins || 0;

}

window.addCoins = async function (amount) {

    await updateDoc(
        doc(db, "users", auth.currentUser.uid),
        {
            coins: increment(amount)
        }
    );

}

window.removeCoins = async function (amount) {

    await updateDoc(
        doc(db, "users", auth.currentUser.uid),
        {
            coins: increment(-amount)
        }
    );

}
