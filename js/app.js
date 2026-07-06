import { auth } from "./firebase.js";

import "./chat.js";
import "./search.js";
import "./auth.js";

const input = document.getElementById("message");

window.sendMessage = async function () {

    if (!window.currentChat) {
        alert("Выберите чат");
        return;
    }

    const text = input.value.trim();

    if (text === "") return;

    await window.sendChatMessage(text);

    input.value = "";

}

input.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        sendMessage();

    }

});
