import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.activateTrial = async function () {

    const user = auth.currentUser;

    if (!user) {
        alert("Необходимо войти в аккаунт.");
        return;
    }

    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        alert("Профиль не найден.");
        return;
    }

    const data = snap.data();

    // Уже есть PRO
    if (data.pro === true) {
        alert("У вас уже активирован TeleGolub Pro.");
        return;
    }

    // Уже использовал пробный период
    if (data.trialUsed === true) {
        alert("Пробный период уже был использован.");
        return;
    }

    const now = new Date();

    const end = new Date();

    end.setDate(now.getDate() + 14);

    await updateDoc(userRef, {

        pro: true,

        trialUsed: true,

        proStarted: Timestamp.fromDate(now),

        proUntil: Timestamp.fromDate(end)

    });

    alert(
`🎉 Успешная активация TeleGolub Pro!

Пробный период активирован на 14 дней.`
    );

    location.href = "index.html";

}
