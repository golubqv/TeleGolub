import { auth, db } from "./firebase.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const storage = getStorage();

window.sendImage = async function(file){

    if(!window.currentChat){
        alert("Откройте чат.");
        return;
    }

    if(!file) return;

    try{

        const fileName = Date.now() + "_" + file.name;

        const imageRef = ref(storage, "chatImages/" + fileName);

        await uploadBytes(imageRef, file);

        const imageUrl = await getDownloadURL(imageRef);

        await addDoc(

            collection(db,"chats",window.currentChat,"messages"),

            {

                sender: auth.currentUser.uid,

                type: "image",

                image: imageUrl,

                time: serverTimestamp(),

                delivered: true,

                read: false

            }

        );

    }catch(e){

        console.error(e);

        alert("Ошибка отправки изображения.");

    }

}
