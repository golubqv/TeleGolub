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

    messages.innerHTML="";

    if(unsubscribe){
        unsubscribe();
    }

    const chatSnap = await getDoc(doc(db,"chats",chatId));

    if(chatSnap.exists()){

        const chat = chatSnap.data();

        const friendUid = chat.members.find(
            uid => uid !== auth.currentUser.uid
        );

        const userSnap = await getDoc(
            doc(db,"users",friendUid)
        );

        if(userSnap.exists()){

            const user = userSnap.data();

            document.getElementById("username").textContent = user.name;

        }

    }

    const q=query(
        collection(db,"chats",chatId,"messages"),
        orderBy("time")
    );

    unsubscribe = onSnapshot(q,(snapshot)=>{

        messages.innerHTML="";

        snapshot.forEach((document)=>{

            const data=document.data();

            const div=document.createElement("div");

            div.className="message";

            if(data.sender===auth.currentUser.uid){
                div.classList.add("me");
            }

            div.textContent=data.text;

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
            sender:auth.currentUser.uid,
