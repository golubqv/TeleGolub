import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let currentChat = null;

window.openChat = async function(uid){

    const myUid = auth.currentUser.uid;

    currentChat = [myUid, uid].sort().join("_");

    document.getElementById("messages").innerHTML="";

    const q = query(
        collection(db,"chats",currentChat,"messages"),
        orderBy("time")
    );

    onSnapshot(q,(snapshot)=>{

        const messages=document.getElementById("messages");

        messages.innerHTML="";

        snapshot.forEach((doc)=>{

            const data=doc.data();

            const div=document.createElement("div");

            div.className="message";

            if(data.sender===myUid){

                div.classList.add("me");

            }

            div.textContent=data.text;

            messages.appendChild(div);

        });

        messages.scrollTop=messages.scrollHeight;

    });

}

window.sendMessage = async function(){

    if(currentChat===null){

        alert("Сначала выберите пользователя");

        return;

    }

    const input=document.getElementById("message");

    const text=input.value.trim();

    if(text==="") return;

    await addDoc(

        collection(db,"chats",currentChat,"messages"),

        {

            sender:auth.currentUser.uid,

            text:text,

            time:serverTimestamp()

        }

    );

    input.value="";

}
