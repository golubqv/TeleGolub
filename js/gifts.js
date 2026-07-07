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

    const user = userSnap.data();

    const giftSnap = await getDoc(doc(db,"gifts",giftId));

    const gift = giftSnap.data();

    if(user.coins < gift.price){

        alert("Недостаточно TeleGolub Coins");

        return;

    }

    await updateDoc(userRef,{

        coins:increment(-gift.price)

    });

    await addDoc(

        collection(db,"users",auth.currentUser.uid,"inventory"),

        {

            giftId,

            receivedAt:serverTimestamp()

        }

    );

    alert("🎉 Подарок куплен!");

    if(window.updateCoins){

        window.updateCoins();

    }

  }
