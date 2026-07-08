import { auth, db } from "./firebase.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const storage = getStorage();

window.uploadAvatar = async function(file){

    if(!file) return;

    const avatarRef = ref(
        storage,
        `avatars/${auth.currentUser.uid}`
    );

    try{

        await uploadBytes(
            avatarRef,
            file
        );

        const url = await getDownloadURL(
            avatarRef
        );

        await updateDoc(
            doc(db,"users",auth.currentUser.uid),
            {
                avatar:url
            }
        );

        alert("✅ Аватар обновлён!");

        location.reload();

    }catch(e){

        console.error(e);

        alert("Ошибка загрузки аватара.");

    }

}
