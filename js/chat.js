import { auth, db } from "./firebase.js";

import {
collection,
doc,
getDoc,
setDoc,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* ========================================= */

window.currentChat=null;
window.friendUid=null;

let unsubscribe=null;

/* ========================================= */

window.createChat=async(friendUid)=>{

const myUid=auth.currentUser.uid;

const chatId=[myUid,friendUid].sort().join("_");

const ref=doc(db,"chats",chatId);

const snap=await getDoc(ref);

if(!snap.exists()){

await setDoc(ref,{

members:[myUid,friendUid],

createdAt:serverTimestamp(),

lastMessage:"",

lastTime:"",

unread:0

});

}

openChat(chatId,friendUid);

};

/* ========================================= */

window.openChat=async(chatId,friendUid)=>{

window.currentChat=chatId;
window.friendUid=friendUid;

const userSnap=await getDoc(

doc(db,"users",friendUid)

);

if(userSnap.exists()){

const u=userSnap.data();

document.getElementById("chatTitle").innerText=
u.username;

}

const messages=document.getElementById("messages");

messages.innerHTML="";

if(unsubscribe){

unsubscribe();

}

unsubscribe=onSnapshot(

query(

collection(db,"chats",chatId,"messages"),

orderBy("time")

),

(snapshot)=>{

messages.innerHTML="";

snapshot.forEach(msg=>{

renderMessage(

msg.id,

msg.data()

);

});

messages.scrollTop=

messages.scrollHeight;

}

);

};

/* ========================================= */

function renderMessage(id,data){

const messages=

document.getElementById("messages");

const div=document.createElement("div");

div.className="message fade";

if(data.sender===auth.currentUser.uid){

div.classList.add("me");

}

let html="";

/* ================= TEXT ================= */

if(data.type==="text"){

html+=`

<div class="message-text">

${escapeHtml(data.text)}

</div>

`;

}

/* ================= IMAGE ================= */

if(data.type==="image"){

html+=`

<img

src="${data.image}"

class="chat-image"

onclick="openImageViewer('${data.image}')"

>

`;

}

/* ================= GIFT ================= */

if(data.type==="gift"){

html+=`

<div class="gift-message">

<div class="gift-big">

${data.giftEmoji}

</div>

<div>

<b>${data.giftName}</b>

<br>

<span>

🎁 Подарок

</span>

</div>

</div>

`;

}

if(data.type==="gift"){
...
}

/* ================= VOICE ================= */

if(data.type==="voice"){

html+=`

<audio controls>

<source
src="${data.audio}"
type="audio/webm">

</audio>

`;

}

/* ================= REPLY ================= */

if(data.reply){

html+=`

<div class="reply-preview">

<div class="reply-name">

↩ Ответ

</div>

<div class="reply-text">

${escapeHtml(data.reply)}

</div>

</div>

`;

}

/* ================= REACTIONS ================= */

html+=`

<div

class="message-reactions"

id="reactions-${id}">

</div>

`;

/* ================= TIME ================= */

const time=data.time?.toDate
?data.time.toDate()
:new Date();

const hours=String(

time.getHours()

).padStart(2,"0");

const minutes=String(

time.getMinutes()

).padStart(2,"0");

let checks="";

if(data.sender===auth.currentUser.uid){

if(data.read){

checks="✔✔";

}else{

checks="✔";

}

}

html+=`

<div class="msg-time">

${hours}:${minutes}

<span class="message-checks">

${checks}

</span>

</div>

`;

div.innerHTML=html;

/* ================= EVENTS ================= */

div.addEventListener(

"contextmenu",

(e)=>{

e.preventDefault();

if(window.openReactionMenu){

openReactionMenu(

id,

e.pageX,

e.pageY

);

}

}

);

div.addEventListener(

"dblclick",

()=>{

if(data.type==="text"){

replyToMessage(

id,

data.text

);

}

}

);

messages.appendChild(div);

}

/* ========================================= */

function escapeHtml(text){

if(!text) return "";

return text

.replaceAll("&","&amp;")

.replaceAll("<","&lt;")

.replaceAll(">","&gt;")

.replaceAll('"',"&quot;")

.replaceAll("'","&#039;");

    }

/* =========================================
   SEND MESSAGE
========================================= */

window.sendMessage = async function () {

    if (!window.currentChat) return;

    const input = document.getElementById("message");

    const text = input.value.trim();

    if (text === "") return;

    let reply = null;

    if (window.getReply) {

        const r = getReply();

        if (r) {

            reply = r.text;

        }

    }

    await addDoc(

        collection(
            db,
            "chats",
            window.currentChat,
            "messages"
        ),

        {

            sender: auth.currentUser.uid,

            text,

            type: "text",

            reply,

            delivered: true,

            read: false,

            time: serverTimestamp()

        }

    );

    await updateDoc(

        doc(db, "chats", window.currentChat),

        {

            lastMessage: text,

            lastTime: new Date().toLocaleTimeString([], {

                hour: "2-digit",

                minute: "2-digit"

            })

        }

    );

    input.value = "";

    if (window.cancelReply) {

        cancelReply();

    }

    if (window.showToast) {

        showToast("Сообщение отправлено");

    }

};

/* =========================================
   MARK READ
========================================= */

window.markMessagesRead = async function () {

    if (!window.currentChat) return;

    const chatRef = doc(
        db,
        "chats",
        window.currentChat
    );

    try {

        await updateDoc(chatRef, {

            unread: 0

        });

    } catch (e) {

        console.error(e);

    }

};

/* =========================================
   IMAGE CLICK
========================================= */

window.openChatImage = function (src) {

    if (window.openImageViewer) {

        openImageViewer(src);

    }

};

/* =========================================
   AUTO READ
========================================= */

const observer = new MutationObserver(() => {

    if (window.currentChat) {

        markMessagesRead();

    }

});

observer.observe(

    document.getElementById("messages"),

    {

        childList: true

    }

);

/* =========================================
   HOTKEYS
========================================= */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        const input = document.getElementById("message");

        input.blur();

    }

});

/* =========================================
   EXPORT
========================================= */

window.renderMessage = renderMessage;
    
