import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

});

window.saveProfile = async function () {

    const name = document.getElementById("name").value.trim();

    let username = document.getElementById("username").value.trim().toLowerCase();

    if (!name || !username) {
        alert("Заполните все поля");
        return;
    }

    username = username.replace("@","");

    const usernameRef = doc(db,"usernames",username);

    const usernameDoc = await getDoc(usernameRef);

    if(usernameDoc.exists()){

        alert("Этот username уже занят");

        return;

    }

    await setDoc(doc(db,"users",currentUser.uid),{

        name:name,

        username:username,

        email:currentUser.email,

        avatar:"",

        bio:"",

        pro:false,

        createdAt:serverTimestamp()

    });

    await setDoc(usernameRef,{

        uid:currentUser.uid

    });

    location.href="index.html";

      }
