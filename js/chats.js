import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* ========================================= */

window.loadChats = function () {

    const user = auth.currentUser;

    if (!user) return;

    const chatList = document.getElementById("chatList");

    const q = query(

        collection(db, "chats"),

        where("members", "array-contains", user.uid)

    );

    onSnapshot(q, async (snapshot) => {

        chatList.innerHTML = "";

        if (snapshot.empty) {

            chatList.innerHTML = `

            <div style="
            padding:40px;
            text-align:center;
            color:#8fa2b8;
            ">

                💬

                <br><br>

                У вас пока нет чатов

            </div>

            `;

            return;

        }

        for (const chat of snapshot.docs) {

            const data = chat.data();

            const friend = data.members.find(id => id !== user.uid);

            const userRef = await getDoc(doc(db, "users", friend));

            if (!userRef.exists()) continue;

            const u = userRef.data();

            const item = document.createElement("div");

            item.className = "chat-item fade";

            item.onclick = () => {

                openChat(chat.id, friend);

                document

                    .querySelectorAll(".chat-item")

                    .forEach(x => x.classList.remove("active"));

                item.classList.add("active");

            };

            const avatar =

                u.photoURL

                ? `<img class="chat-avatar" src="${u.photoURL}">`

                : `<div class="chat-avatar">
                        ${(u.username || "?")[0].toUpperCase()}
                   </div>`;

            item.innerHTML = `

                ${avatar}

                <div class="chat-info">

                    <div class="chat-name">

                        ${u.username}

                    </div>

                    <div class="chat-last">

                        ${
                            data.lastMessage
                            || "Начните общение"
                        }

                    </div>

                </div>

                <div class="chat-right">

                    <div class="chat-time">

                        ${
                            data.lastTime || ""
                        }

                    </div>

                    ${
                        data.unread
                        ? `<div class="unread">
                                ${data.unread}
                           </div>`
                        : ""
                    }

                </div>

            `;

            chatList.appendChild(item);

        }

    });

};

/* ========================================= */

auth.onAuthStateChanged(user => {

    if (user) {

        loadChats();

    }

});
