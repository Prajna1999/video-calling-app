const messageContainer=document.getElementById("messages");
messageContainer.scrollTop=messageContainer.scrollHeight; //scroll pil position relative to the scroller.

const memberContainer=document.querySelector("#members__container");
const memberButton=document.querySelector("#members__button");

const chatContainer=document.querySelector("#messages__container");
const chatButton=document.querySelector("#chat__button");

let activeMemberContainer=false;

memberButton.addEventListener("click", ()=>{
  // if(activeMemberContainer){
  //   memberContainer.style.display="none";
  // }else{
  //   memberContainer.style.display="block";
  // }
  // activeMemberContainer=!activeMemberContainer;
  //refactoring
  memberContainer.classList.toggle("show");
})

chatButton.addEventListener("click",()=>{
  chatContainer.classList.toggle("show")
});