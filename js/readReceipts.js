import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.markMessagesRead = async function(chatId){

    const q = query(

        collection(db,"chats",chatId,"messages"),

        where("sender","!=",auth.currentUser.uid),

        where("read","==",false)

    );

    const snap = await getDocs(q);

    for(const msg of snap.docs){

        await updateDoc(msg.ref,{

            read:true

        });

    }

}
