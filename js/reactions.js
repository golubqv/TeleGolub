const emojis=[
"❤️",
"👍",
"😂",
"🔥",
"😮",
"😢"
];

window.openReactionMenu=function(id,x,y){

const old=document.getElementById("reactionMenu");

if(old) old.remove();

const menu=document.createElement("div");

menu.id="reactionMenu";

menu.style.position="fixed";

menu.style.left=x+"px";

menu.style.top=y+"px";

menu.style.display="flex";

menu.style.gap="8px";

menu.style.padding="10px";

menu.style.borderRadius="18px";

menu.style.background="#1f2937";

menu.style.boxShadow="0 10px 30px rgba(0,0,0,.4)";

menu.style.zIndex=9999;

emojis.forEach(emoji=>{

const b=document.createElement("button");

b.innerHTML=emoji;

b.style.fontSize="24px";

b.style.background="none";

b.style.border="none";

b.style.cursor="pointer";

b.onclick=()=>{

addReaction(id,emoji);

menu.remove();

};

menu.appendChild(b);

});

document.body.appendChild(menu);

setTimeout(()=>{

document.onclick=()=>{

menu.remove();

document.onclick=null;

};

},100);

};

window.addReaction=function(id,emoji){

const div=document.getElementById("reactions-"+id);

if(!div) return;

const span=document.createElement("span");

span.className="reaction";

span.innerHTML=emoji;

div.appendChild(span);

};
