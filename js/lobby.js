const form=document.getElementById("lobby__form");

//grab the display name from the sessionStorage.

let displayName=sessionStorage.getItem("display-name");

if(displayName){
    form.name.value=displayName;
}

form.addEventListener("submit", (e)=>{
    e.preventDefault();

    let inviteCode=e.target.room.value;

    //set the username to the local Storage.
    sessionStorage.setItem("display-name", e.target.name.value);
    //create an invite code if not any.
    if(!inviteCode){
        inviteCode=String(Math.floor(Math.random()*10000));
    }
    // redirect the user to the room via roomID.
    window.location=`room.html?room=${inviteCode}`;
})