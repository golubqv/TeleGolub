import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    getDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let canUseAI = false;

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
        location.href = "setup.html";
        return;
    }

    const data = snap.data();

    if (!data.pro) {

        document.getElementById("aiInput").disabled = true;

        document.getElementById("aiInput").placeholder =
            "TeleGolub AI доступен только для Pro";

        return;

    }

    if (data.proUntil) {

        const now = Timestamp.now();

        if (data.proUntil.seconds < now.seconds) {

            document.getElementById("aiInput").disabled = true;

            document.getElementById("aiInput").placeholder =
                "Подписка TeleGolub Pro закончилась";

            return;

        }

    }

    canUseAI = true;

});

window.sendAI = async function () {

    if (!canUseAI) return;

    const input = document.getElementById("aiInput");

    const text = input.value.trim();

    if (text === "") return;

    const messages = document.getElementById("aiMessages");

    messages.innerHTML += `
        <div class="ai-message user">
            ${text}
        </div>
    `;

    input.value = "";

    messages.scrollTop = messages.scrollHeight;

    try {

        const response = await fetch("/api/ai", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: text,

                uid: auth.currentUser.uid

            })

        });

        const result = await response.json();

        messages.innerHTML += `
            <div class="ai-message bot">
                ${result.reply}
            </div>
        `;

    } catch (e) {

        messages.innerHTML += `
            <div class="ai-message bot">
                ⚠️ TeleGolub AI пока недоступен.
                Подключите сервер AI.
            </div>
        `;

    }

    messages.scrollTop = messages.scrollHeight;

}

document.getElementById("aiInput").addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        sendAI();

    }

});
