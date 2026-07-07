import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.currentInventoryType = "basic";

onAuthStateChanged(auth, (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    loadInventory("basic");

});

window.loadInventory = async function(type){

    currentInventoryType = type;

    document.querySelectorAll(".tab").forEach(tab=>{

        tab.classList.remove("active");

    });

    if(type==="basic"){

        document.querySelectorAll(".tab")[0].classList.add("active");

    }

    if(type==="collectible"){

        document.querySelectorAll(".tab")[1].classList.add("active");

    }

    if(type==="nft"){

        document.querySelectorAll(".tab")[2].classList.add("active");

    }

    const list=document.getElementById("inventoryList");

    list.innerHTML="";

    const inventory=await getDocs(

        collection(db,"users",auth.currentUser.uid,"inventory")

    );

    for(const item of inventory.docs){

        const inv=item.data();

        const giftSnap=await getDoc(

            doc(db,"gifts",inv.giftId)

        );

        if(!giftSnap.exists()) continue;

        const gift=giftSnap.data();

        if(gift.type!==type) continue;

        let rarity=gift.rarity||"Common";

        let uniqueId=inv.uniqueId||"-";

        list.innerHTML+=`

        <div class="gift-card">

            <div class="gift-emoji">

                ${gift.emoji}

            </div>

            <div class="gift-name">

                ${gift.name}

            </div>

            <div class="gift-id">

                ${uniqueId}

            </div>

            <div class="rarity ${rarity.toLowerCase()}">

                ${rarity}

            </div>

            <button onclick="giftInfo('${item.id}')">

                Подарить

            </button>

        </div>

        `;

    }

}

window.giftInfo = async function(id){

    alert("Карточка подарка появится в следующем обновлении.");

}
