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
window.friendUid = null;

let unsubscribeMessages = null;

window.createChat = async function(friendUid){

    const myUid = auth.currentUser.uid;

    const chatId = [myUid, friendUid].sort().join("_");

    const ref = doc(db,"chats",chatId);

    const snap = await getDoc(ref);

    if(!snap.exists()){

        await setDoc(ref,{
            members:[myUid,friendUid],
            createdAt:serverTimestamp()
        });

    }

    openChat(chatId,friendUid);

}

window.openChat=function(chatId,friend){

    window.currentChat=chatId;
    window.friendUid=friend;

    if(window.watchUserStatus){

        watchUserStatus(friend);

    }

    if(window.enableTyping){

        enableTyping(chatId);

    }

    if(window.watchTyping){

        watchTyping(chatId,friend);

    }

    const messages=document.getElementById("messages");

    messages.innerHTML="";

    if(unsubscribeMessages){

        unsubscribeMessages();

    }

    unsubscribeMessages=onSnapshot(

        query(

            collection(db,"chats",chatId,"messages"),

            orderBy("time")

        ),

        snapshot=>{

            messages.innerHTML="";

            snapshot.forEach(msg=>{

                const data=msg.data();

                const div=document.createElement("div");

                div.className="message";

                if(data.sender===auth.currentUser.uid){

                    div.classList.add("me");

                }

                if(data.type==="gift"){

                    div.innerHTML=`

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

                }else{

                    div.innerHTML=data.text;

                }

                messages.appendChild(div);

            });

            messages.scrollTop=messages.scrollHeight;

        }

    );

}

window.sendMessage=async function(){

    const input=document.getElementById("message");

    const text=input.value.trim();

    if(text==="") return;

    if(!window.currentChat) return;

    await addDoc(

        collection(db,"chats",window.currentChat,"messages"),

        {

            sender:auth.currentUser.uid,

            text:text,

            type:"text",

            time:serverTimestamp(),

            delivered:true,

            read:false

        }

    );

    input.value="";

}
