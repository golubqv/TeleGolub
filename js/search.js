import { db, auth } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const searchInput = document.getElementById("search");
const result = document.getElementById("searchResult");

window.searchUser = async function () {

    const value = searchInput.value
        .trim()
        .toLowerCase()
        .replace("@", "");

    result.innerHTML = "";

    if (value.length < 2) return;

    const q = query(
        collection(db, "users"),
        where("username", "==", value)
    );

    const snap = await getDocs(q);

    if (snap.empty) {

        result.innerHTML = `
            <div class="user-card">
                Пользователь не найден
            </div>
        `;

        return;

    }

    snap.forEach((document) => {

        const user = document.data();

        if (user.uid === auth.currentUser.uid) return;

        result.innerHTML += `

        <div class="user-card">

            <div style="display:flex;align-items:center;gap:12px;">

                <div class="avatar"></div>

                <div>

                    <b>${user.name}</b>

                    <br>

                    <small>@${user.username}</small>

                </div>

            </div>

            <button
                onclick="createChat('${user.uid}')">

                Написать

            </button>

        </div>

        `;

    });

}

window.createChat = async function(uid){

    alert("Следующим файлом мы подключим личные чаты 😊");

}
