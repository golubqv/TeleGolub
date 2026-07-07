import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.loadChats = function () {

    const list = document.getElementById("chatList");

    const q = query(
        collection(db, "chats"),
        where("members", "array-contains", auth.currentUser.uid)
    );

    onSnapshot(q, (snapshot) => {

        list.innerHTML = "";

        snapshot.forEach((doc) => {

            const chat = doc.data();

            list.innerHTML += `

            <div
                class="chat-item"
                onclick="openChat('${doc.id}')">

                <div class="avatar"></div>

                <div>

                    <b>${chat.lastMessage || "Новый чат"}</b>

                    <br>

                    <small>
                        ${chat.members.length} участника
                    </small>

                </div>

            </div>

            `;

        });

    });

}
