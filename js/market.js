import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    increment,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const UPDATE_TIME = 5 * 60 * 1000;

window.loadMarket = async function(){

    const list = document.getElementById("marketList");

    list.innerHTML = "";

    const gifts = await getDocs(collection(db,"gifts"));

    gifts.forEach(giftDoc=>{

        const gift = giftDoc.data();

        const discount =
            Math.floor(Math.random()*81)+10;

        const newPrice =
            Math.floor(
                gift.price*(100-discount)/100
            );

        list.innerHTML += `

        <div class="market-card">

            <div class="market-emoji">

                ${gift.emoji}

            </div>

            <div class="market-name">

                ${gift.name}

            </div>

            <div class="discount">

                -${discount}%

            </div>

            <div class="old-price">

                ${gift.price} 🪙

            </div>

            <div class="new-price">

                ${newPrice} 🪙

            </div>

            <button
            class="buy-btn"
            onclick="buyMarketGift(
                '${giftDoc.id}',
                ${newPrice}
            )">

            Купить

            </button>

        </div>

        `;

    });

}

window.buyMarketGift = async function(id,price){

    const userRef = doc(
        db,
        "users",
        auth.currentUser.uid
    );

    const userSnap = await getDoc(userRef);

    if(!userSnap.exists()) return;

    const user = userSnap.data();

    if(user.coins < price){

        alert("Недостаточно Coins.");

        return;

    }

    const giftSnap =
        await getDoc(doc(db,"gifts",id));

    if(!giftSnap.exists()) return;

    const gift = giftSnap.data();

    await updateDoc(userRef,{

        coins:increment(-price)

    });

    await addDoc(

        collection(
            db,
            "users",
            auth.currentUser.uid,
            "inventory"
        ),

        {

            giftId:id,

            name:gift.name,

            emoji:gift.emoji,

            rarity:gift.rarity,

            type:gift.type,

            uniqueId:
                "TG-"+
                Date.now(),

            createdAt:serverTimestamp(),

            receivedAt:serverTimestamp(),

            source:"Get a Gifts"

        }

    );

    alert("🎉 Подарок успешно куплен!");

    loadMarket();

}

loadMarket();

setInterval(loadMarket,UPDATE_TIME);
