import { db } from "./firebase.js";

import {
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.watchUserStatus = function(uid){

    const status = document.getElementById("userStatus");

    if(!status) return;

    onSnapshot(doc(db,"users",uid),(snap)=>{

        if(!snap.exists()) return;

        const user = snap.data();

        if(user.online){

            status.innerHTML="🟢 В сети";

            return;

        }

        if(!user.lastSeen){

            status.innerHTML="⚫ Был недавно";

            return;

        }

        const date=new Date(user.lastSeen.seconds*1000);

        const now=new Date();

        const sameDay=
            date.toDateString()===now.toDateString();

        if(sameDay){

            status.innerHTML=
                "🕒 Был(а) сегодня в "+
                date.toLocaleTimeString("ru-RU",{
                    hour:"2-digit",
                    minute:"2-digit"
                });

            return;

        }

        const yesterday=new Date();

        yesterday.setDate(yesterday.getDate()-1);

        if(date.toDateString()===yesterday.toDateString()){

            status.innerHTML="🕒 Был(а) вчера";

            return;

        }

        status.innerHTML="⚫ Был(а) недавно";

    });

}
