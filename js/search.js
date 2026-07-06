import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.searchUser = async function () {

    const input = document.getElementById("search");
    const result = document.getElementById("searchResult");

    const username = input.value
        .trim()
        .toLowerCase()
        .replace("@", "");

    result.innerHTML = "";

    if (username === "") return;

    const q = query(
        collection(db, "users"),
        where("username", "==", username)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        result.innerHTML = `
        <div class="user-card">
            Пользователь не найден
        </div>
        `;

        return;
    }

    snapshot.forEach((doc) => {

        const user = doc.data();

        result.innerHTML += `

        <div class="user-card">

            <div style="display:flex;align-items:center;gap:12px;">

                <div class="avatar"></div>

                <div>

                    <b>${user.name}</b><br>

                    <small>@${user.username}</small>

                </div>

            </div>

            <button
                onclick="openChat('${doc.id}')">

                Чат

            </button>

        </div>

        `;

    });

}
