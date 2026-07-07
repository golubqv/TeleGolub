import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.currentChat = null;

let unsubscribe = null;

window.createChat = async function(friendUid){

    const myUid = auth.currentUser.uid;

    const chatId = [myUid, friendUid].sort().join("_");

    const chatRef = doc(db,"chats",chatId);

    const chatSnap = await getDoc(chatRef);

    if(!chatSnap.exists()){

        await setDoc(chatRef,{

            members:[myUid,friendUid],

            createdAt:serverTimestamp(),

            lastMessage:"",

            lastTime:serverTimestamp()

        });

    }

    openChat(chatId);

}

window.openChat = async function(chatId){

    window.currentChat = chatId;

    const messages = document.getElementById("messages");

    messages.innerHTML = "";

    if(unsubscribe){

        unsubscribe();

    }

    const q = query(

        collection(db,"chats",chatId,"messages"),

        orderBy("time")

    );

    unsubscribe = onSnapshot(q,(snapshot)=>{

        messages.innerHTML = "";

        snapshot.forEach((document)=>{

            const data = document.data();

            const div = document.createElement("div");

            div.className = "message";

            if(data.sender===auth.currentUser.uid){

                div.classList.add("me");

            }

            // 🎁 Подарок
            if(data.type==="gift"){

                div.innerHTML = `

                <div class="gift-message">

                    <div class="gift-big">

                        ${data.giftEmoji}

                    </div>

                    <div>

                        <b>${data.giftName}</b>

                        <br>

                        🎁 Подарок

                    </div>

                </div>

                `;

            }

            // 💬 Текст
            else{

                let time="";

                if(data.time?.seconds){

                    const date=new Date(data.time.seconds*1000);

                    time=date.toLocaleTimeString("ru-RU",{

                        hour:"2-digit",

                        minute:"2-digit"

                    });

                }

                div.innerHTML = `

                    <div>${data.text}</div>

                    <small class="msg-time">

                        ${time}

                    </small>

                `;

            }

            messages.appendChild(div);

        });

        messages.scrollTop = messages.scrollHeight;

    });

}

window.sendChatMessage = async function(text){

    if(!window.currentChat) return;

    await addDoc(

        collection(db,"chats",window.currentChat,"messages"),

        {

            type:"text",

            sender:auth.currentUser.uid,

            text:text,

            time:serverTimestamp()

        }

    );

    await setDoc(

        doc(db,"chats",window.currentChat),

        {

            lastMessage:text,

            lastTime:serverTimestamp()

        },

        {

            merge:true

        }

    );

               }
