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

let recorder;
let chunks = [];

window.startRecording = async function(){

    try{

        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true
        });

        recorder = new MediaRecorder(stream);

        chunks = [];

        recorder.ondataavailable = e => {

            chunks.push(e.data);

        };

        recorder.onstop = async ()=>{

            const blob = new Blob(chunks,{
                type:"audio/webm"
            });

            const name = Date.now()+".webm";

            const voiceRef = ref(storage,"voices/"+name);

            await uploadBytes(voiceRef,blob);

            const url = await getDownloadURL(voiceRef);

            await addDoc(

                collection(
                    db,
                    "chats",
                    window.currentChat,
                    "messages"
                ),

                {

                    sender:auth.currentUser.uid,

                    type:"voice",

                    audio:url,

                    time:serverTimestamp(),

                    delivered:true,

                    read:false

                }

            );

        };

        recorder.start();

        document.getElementById("voiceBtn").innerHTML="⏹";

    }catch(e){

        alert("Не удалось получить доступ к микрофону.");

    }

}

window.stopRecording = function(){

    if(recorder){

        recorder.stop();

        document.getElementById("voiceBtn").innerHTML="🎤";

    }

}

window.voiceClick=function(){

    if(!recorder || recorder.state==="inactive"){

        startRecording();

    }else{

        stopRecording();

    }

}
