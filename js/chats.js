import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.loadChats = function () {

    const list = document.getElementById("chatList");

    const q = query(
        collection(db, "chats"),
        where("members", "array-contains", auth.currentUser.uid)
    );

    onSnapshot(q, async (snapshot) => {

        list.innerHTML = "";

        const chats = snapshot.docs;

        chats.sort((a, b) => {

            const ta = a.data().lastTime?.seconds || 0;
            const tb = b.data().lastTime?.seconds || 0;

            return tb - ta;

        });

        for (const chatDoc of chats) {

            const chat = chatDoc.data();

            const friendUid = chat.members.find(
                uid => uid !== auth.currentUser.uid
            );

            if (!friendUid) continue;

            const userSnap = await getDoc(
                doc(db, "users", friendUid)
            );

            if (!userSnap.exists()) continue;

            const user = userSnap.data();

            let time = "";

            if (chat.lastTime?.seconds) {

                const date = new Date(chat.lastTime.seconds * 1000);

                time = date.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit"
                });

            }

            list.innerHTML += `

            <div
                class="chat-item"
                onclick="openChat('${chatDoc.id}')">

                <div class="avatar">

                    ${user.name.charAt(0).toUpperCase()}

                </div>

                <div class="chat-info">

                    <div style="display:flex;justify-content:space-between;">

                        <b>${user.name}</b>

                        <small>${time}</small>

                    </div>

                    <small>

                        ${chat.lastMessage || "Начните общение"}

                    </small>

                </div>

            </div>

            `;

        }

    });

}
