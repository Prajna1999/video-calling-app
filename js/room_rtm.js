//handle memeber joined.

const handleMemberJoined=async(memberId)=>{
    console.log("A new member has joind the channel", memberId);
    addMemberToDom(memberId);
}   

//add the memebers to the UI/DOM.
const addMemberToDom=async(memberId)=>{

    //get the name value from user attributes by name from the room_rtc js.Also destructure the return value.
    let {name}=await rtmClient.getUserAttributesByKeys(memberId,['name'])

    const membersWrapper=document.getElementById("member__list");
    let memberItem= `<div class="member__wrapper" id="member__${memberId}__wrapper">
                        <span class="green__icon"></span>
                        <p class="member_name">${name}</p>
                    </div>`

    membersWrapper.insertAdjacentHTML("beforeend", memberItem);
}

//handle user left event
const handleMemberLeft=async(memberId)=>{
    removeMemberFromDom(memberId);
}

//remove the member from the DOM
const removeMemberFromDom=async(memberId)=>{
    let memberWrapper=document.getElementById(`member__${memberId}__wrapper`);
    memberWrapper.remove()
};

//show all channel members to everyone.
const getMembers=async()=>{
    let members=await rtmChannel.getMembers();

    members.forEach(member=>addMemberToDom(member));
}

//when the user shuts his computer down.
const leaveChannel=async(e)=>{
    // e.preventDefault();
    await rtmChannel.leave();
    await rtmClient.logout();
}

//ensure the function is called everytime.
window.addEventListener("beforeunload", leaveChannel);