import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

window.searchUser = async function () {

const username = document
.getElementById("search")
.value
.trim()
.toLowerCase()
.replace("@","");

const list = document.getElementById("searchResult");

list.innerHTML = "";

if(username==="") return;

const q=query(
collection(db,"users"),
where("username","==",username)
);

const snap=await getDocs(q);

snap.forEach(doc=>{

const user=doc.data();

list.innerHTML+=`

<div class="user-card">

<div class="avatar"></div>

<div>

<b>${user.name}</b><br>

<small>@${user.username}</small>

</div>

<button onclick="openChat('${doc.id}')">

Открыть

</button>

</div>

`;

});

}
