let replyMessage = null;

window.replyToMessage = function (id, text) {
    replyMessage = {
        id,
        text
    };

    let box = document.getElementById("replyBox");

    if (!box) {
        box = document.createElement("div");
        box.id = "replyBox";
        box.className = "reply-box";

        document.querySelector(".send").prepend(box);
    }

    box.innerHTML = `
        <div class="reply-content">
            <b>Ответ</b><br>
            ${text}
        </div>

        <button onclick="cancelReply()">✕</button>
    `;
};

window.cancelReply = function () {

    replyMessage = null;

    const box = document.getElementById("replyBox");

    if (box) box.remove();

};

window.getReply = function () {
    return replyMessage;
};
