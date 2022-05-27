const APP_ID="e376f9d75b694483b14a7075a48748ce";
let UID=sessionStorage.getItem("uid");

if(!UID){
    UID=String(Math.floor(Math.random()*10000))
    sessionStorage.setItem("UID", UID);
}

let token=null;

let client;

//room.html?room=234
const queryString=window.location.search;
const urlParams=new URLSearchParams(queryString);
let roomId=urlParams.get("room");

if(!roomId){
    // window.location="lobby.html";
    roomId="main";
}

let localTracks=[];
let remoteUser={};

let joinRoomInit=async()=>{
    client=AgoraRTC.createClient({mode:'rtc', codec:'vp8'});
    await client.join(APP_ID,roomId,token,UID);

    joinStream();
}

let joinStream=async()=>{
    localTracks=await AgoraRTC.createMicrophoneAndCameraTracks();

    let player=` <div class="video__container" id="user-container-${UID}">
                    <div class="video-player" id="user-${UID}"></div>
                        </div>`

    document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UID}`);
}
window.addEventListener("DOMContentLoaded", joinStream);
// joinRoomInit();