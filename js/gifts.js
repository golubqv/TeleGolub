import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    increment,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.openGiftStore = async function () {

    const modal = document.getElementById("giftStore");
    const list = document.getElementById("giftList");

    modal.style.display = "flex";
    list.innerHTML = "";

    const gifts = await getDocs(collection(db, "gifts"));

    gifts.forEach((giftDoc) => {

        const gift = giftDoc.data();

        list.innerHTML += `

        <div class="gift-card">

            <div class="gift-emoji">
                ${gift.emoji}
            </div>

            <h3>${gift.name}</h3>

            <p>${gift.price} 🪙</p>

            <button onclick="buyGift('${giftDoc.id}')">
                Купить
            </button>

        </div>

        `;

    });

}

window.closeGiftStore = function(){

    document.getElementById("giftStore").style.display="none";

}

window.buyGift = async function(giftId){

    const userRef = doc(db,"users",auth.currentUser.uid);

    const userSnap = await getDoc(userRef);

    if(!userSnap.exists()) return;

    const user = userSnap.data();

    const giftSnap = await getDoc(doc(db,"gifts",giftId));

    if(!giftSnap.exists()) return;

    const gift = giftSnap.data();

    if(user.coins < gift.price){

        alert("Недостаточно TeleGolub Coins.");

        return;

    }

    await updateDoc(userRef,{
        coins:increment(-gift.price)
    });

    const uniqueId =
        "TG-" +
        Date.now() +
        "-" +
        Math.floor(Math.random()*10000);

    await addDoc(

        collection(db,"users",auth.currentUser.uid,"inventory"),

        {

            giftId:giftId,

            name:gift.name,

            emoji:gift.emoji,

            rarity:gift.rarity || "Common",

            type:gift.type,

            uniqueId:uniqueId,

            owners:[auth.currentUser.uid],

            createdAt:serverTimestamp(),

            receivedAt:serverTimestamp()

        }

    );

    if(window.updateCoins){

        window.updateCoins();

    }

    alert("🎉 Подарок успешно добавлен в инвентарь!");

    closeGiftStore();

}
