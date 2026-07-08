import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let typingTimeout;

window.enableTyping = function(chatId){

    const input = document.getElementById("message");

    if(!input) return;

    input.addEventListener("input",()=>{

        clearTimeout(typingTimeout);

        setDoc(
            doc(db,"chats",chatId,"typing",auth.currentUser.uid),
            {
                typing:true
            }
        );

        typingTimeout=setTimeout(()=>{

            setDoc(
                doc(db,"chats",chatId,"typing",auth.currentUser.uid),
                {
                    typing:false
                }
            );

        },2000);

    });

}

window.watchTyping=function(chatId,friendUid){

    const status=document.getElementById("userStatus");

    onSnapshot(

        doc(db,"chats",chatId,"typing",friendUid),

        snap=>{

            if(!snap.exists()) return;

            const data=snap.data();

            if(data.typing){

                status.innerHTML="⌨️ печатает...";

            }

        }

    );

}
