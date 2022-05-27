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

const displayFrame=document.querySelector('#stream__box');
const videoFrames=document.querySelectorAll('.video__container');
let userIdDisplayFrame=null;

const expandVideoFrame=(e)=>{

  let child=displayFrame.children[0];
  if(child){
    //append back to the streams container
      document.getElementById("streams__container").appendChild(child);
  }
  displayFrame.style.display="block";
  //add to the banner frame.
  displayFrame.appendChild(e.target.parentElement.parentElement.parentElement);
  userIdDisplayFrame=e.target.id;
  
  // shrink the sizes of other users.
  videoFrames.forEach((frame)=>{
    if(frame.id==userIdDisplayFrame){
      frame.style.height="100px";
      frame.style.width="100px";
      console.log("Hey", frame);
    }
  })


};
document.addEventListener("click", (e)=>{
  if(e.target.parentElement.parentElement.parentElement.classList.contains("video__container")){
      expandVideoFrame(e);
  }
})
