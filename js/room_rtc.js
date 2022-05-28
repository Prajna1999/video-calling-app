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

//the user must have a displayname. otherwise redirect theuser to the lobby page.
//it uses sessionStorage.

let displayName=sessionStorage.getItem("display-name");

if(!displayName){
    window.location=`lobby.html`;
}

let localTracks=[];
let remoteUsers={};

let localScreenTracks;
let sharingScreen=false;

let joinRoomInit=async()=>{
    client= AgoraRTC.createClient({mode:'rtc', codec:'vp8'});
    await client.join(APP_ID,roomId,token,uid);

    client.on('user-published', handleUserPublished);
    client.on('user-left', handleUserLeft);
    joinStream();
}

let joinStream=async()=>{
    localTracks=await AgoraRTC.createMicrophoneAndCameraTracks({},{encoderConfig:{
        width:{min:640, ideal:1920, max:1920},
        height:{min:480, ideal:1080, max:1080}
    }});

    let player=` <div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>
                        </div>`

    document.getElementById('streams__container').insertAdjacentHTML('beforeend', player);
    document.getElementById(`user-container-${uid}`).addEventListener("click", expandVideoFrame);

    // localTracks[1].play(`user-${uid}`);
    // localTracks[0].play(`user-${uid}`);
    localTracks.forEach((track)=>{
        track.play(`user-${uid}`)
    })

    //publish the track to the channel.
    await client.publish([localTracks[0],localTracks[1]])
    
}
const switchToCamera=async()=>{
    //grab the user video stream DOM element.
    let player=` <div class="video__container" id="user-container-${uid}">
                        <div class="video-player" id="user-${uid}"></div>
                </div>`
    //put inside the banner frame display.
    displayFrame.insertAdjacentHTML("beforeend", player);

    //mute the users audio and video tracks for better UX.
    await localTracks[0].setMuted(true);
    await localTracks[1].setMuted(true);

    // change the mic and camera btns to muted state.
    document.getElementById('mic-btn').classList.remove('active');
    document.getElementById('screen-btn').classList.remove('active');

    //play local video dream.
    localTracks[1].play(`user-${uid}`);

    //publish only the video track as audiotrack is already published and muted.
    await client.publish([localTracks[1]]);


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
            document.getElementById(`user-container-${user.uid}`).addEventListener("click", expandVideoFrame);

            console.log("Player 2 joined")
    }
    if(displayFrame.style.display){
        const videoFrame=document.getElementById(`user-container-${user.uid}`)
        videoFrame.style.height="100%";
        videoFrame.style.width="100%";
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

    if(userIdDisplayFrame===`user-container-${user.uid}`){
        displayFrame.style.display=null;
    }
}
// window.addEventListener("DOMContentLoaded", joinStream);
joinRoomInit();

// toggleCamera.

const toggleCamera=async(e)=>{
    const button=e.currentTarget;

    if(localTracks[1].muted){
        await localTracks[1].setMuted(false);
        button.classList.add("active");
    }else{
        await localTracks[1].setMuted(true);
        button.classList.remove("active")
    }
}

//toggle mic
const toggleMic=async(e)=>{
    const button=e.currentTarget;

    if(localTracks[0].muted){
        await localTracks[0].setMuted(false);
        button.classList.add("active");
    }else{
        await localTracks[0].setMuted(true);
        button.classList.remove("active")
    }
}

//screen share.
const toggleScreen=async(e)=>{
    let screenButton=e.currentTarget;
    const cameraBtn=document.getElementById("camera-btn");

    if(!sharingScreen){
        sharingScreen=true;

        screenButton.classList.add("active");
        cameraBtn.classList.remove("active");
        cameraBtn.style.display="block";

        localScreenTracks=await AgoraRTC.createScreenVideoTrack();
        document.getElementById(`user-container-${uid}`).remove();
        displayFrame.style.display="block";

        let player=` <div class="video__container" id="user-container-${uid}">
                        <div class="video-player" id="user-${uid}"></div>
                    </div>`
        displayFrame.insertAdjacentHTML("beforeend", player)
        document.getElementById(`user-container-${uid}`).addEventListener("click", expandVideoFrame);

        userIdDisplayFrame=`user-container-${uid}`;
        localScreenTracks.play(`user-${uid}`);

        //unpublish the current video track
        await client.unpublish([localTracks[1]])
        // publish the local screen track.
        await client.publish(localScreenTracks);

    }else{
        sharingScreen=false;
        cameraBtn.style.display="block";
        //remove the ui element.
        document.getElementById(`user-container-${uid}`).remove();
        await client.unpublish([localScreenTracks]);
        // await client.publish([localTracks[1]])

        switchToCamera();

    }
}
document.getElementById("camera-btn").addEventListener("click",toggleCamera);
document.getElementById("mic-btn").addEventListener("click",toggleMic);
document.getElementById('screen-btn').addEventListener("click", toggleScreen);