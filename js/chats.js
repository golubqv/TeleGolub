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

        for (const chatDoc of snapshot.docs) {

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

            list.innerHTML += `

            <div
                class="chat-item"
                onclick="openChat('${chatDoc.id}')">

                <div class="avatar">

                    ${user.name.charAt(0).toUpperCase()}

                </div>

                <div class="chat-info">

                    <b>${user.name}</b>

                    <br>

                    <small>

                        ${chat.lastMessage || "Начните общение"}

                    </small>

                </div>

            </div>

            `;

        }

    });

}
