import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

onAuthStateChanged(auth,(user)=>{

    if(!user) return;

    const ref=doc(db,"users",user.uid);

    async function online(){

        await setDoc(ref,{

            online:true,

            lastSeen:serverTimestamp()

        },{merge:true});

    }

    async function offline(){

        await setDoc(ref,{

            online:false,

            lastSeen:serverTimestamp()

        },{merge:true});

    }

    online();

    setInterval(online,30000);

    window.addEventListener("beforeunload",offline);

    document.addEventListener("visibilitychange",()=>{

        if(document.hidden){

            offline();

        }else{

            online();

        }

    });

});
