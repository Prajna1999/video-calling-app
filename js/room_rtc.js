const APP_ID="e376f9d75b694483b14a7075a48748ce";
let uid=sessionStorage.getItem("uid");

if(!uid){
    uid=String(Math.floor(Math.random()*10000))
    sessionStorage.setItem("uid", uid);
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
let remoteUsers={};

let joinRoomInit=async()=>{
    client= AgoraRTC.createClient({mode:'rtc', codec:'vp8'});
    await client.join(APP_ID,roomId,token,uid);

    client.on('user-published', handleUserPublished);
    client.on('user-left', handleUserLeft);
    joinStream();
}

let joinStream=async()=>{
    localTracks=await AgoraRTC.createMicrophoneAndCameraTracks();

    let player=` <div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>
                        </div>`

    document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${uid}`);
    localTracks[0].play(`user-${uid}`);

    //publish the track to the channel.
    await client.publish([localTracks[0],localTracks[1]])
    
}

let handleUserPublished=async(user,mediaType)=>{
    remoteUsers[user.uid]=user;

    await client.subscribe(user,mediaType);

    let player=document.getElementById(`user-container-${user.uid}`);

    //to make sure we don't have duplicate streams  
    if(player==null){
        player=` <div class="video__container" id="user-container-${user.uid}">
                    <div class="video-player" id="user-${user.uid}"></div>
                </div>`
        
            document.getElementById('streams__container').insertAdjacentHTML('beforeend', player);
            console.log("Player 2 joined")
    }

    if(mediaType==='video'){
        user.videoTrack.play(`user-${user.uid}`);
    }
    if(mediaType==='audio'){
        user.audioTrack.play(`user-${user.uid}`);
    }
}
let handleUserLeft=async(user)=>{
    delete remoteUsers[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();
}
// window.addEventListener("DOMContentLoaded", joinStream);
joinRoomInit();
