import { auth, db } from "./firebase.js";

import {
    collection,
    addDoc,
    doc,
    getDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.sendGift = async function(inventoryId){

    if(!window.currentChat){

        alert("Откройте чат.");

        return;

    }

    const chatSnap = await getDoc(
        doc(db,"chats",window.currentChat)
    );

    if(!chatSnap.exists()) return;

    const members = chatSnap.data().members;

    const receiver = members.find(
        uid => uid !== auth.currentUser.uid
    );

    const invRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "inventory",
        inventoryId
    );

    const invSnap = await getDoc(invRef);

    if(!invSnap.exists()){

        alert("Подарок не найден.");

        return;

    }

    const gift = invSnap.data();

    await addDoc(

        collection(
            db,
            "users",
            receiver,
            "inventory"
        ),

        {

            ...gift,

            from:auth.currentUser.uid,

            receivedAt:serverTimestamp()

        }

    );

    await addDoc(

        collection(
            db,
            "chats",
            window.currentChat,
            "messages"
        ),

        {

            type:"gift",

            sender:auth.currentUser.uid,

            giftId:gift.giftId,

            giftEmoji:gift.emoji,

            giftName:gift.name,

            time:serverTimestamp()

        }

    );

    await deleteDoc(invRef);

    alert("🎁 Подарок отправлен!");

}
