function sendMessage(){

const input=document.getElementById("message");

if(input.value==="") return;

const div=document.getElementById("messages");

div.innerHTML+=`<p>${input.value}</p>`;

input.value="";

div.scrollTop=div.scrollHeight;

}
