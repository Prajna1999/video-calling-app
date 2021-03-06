//handle memeber joined.

const handleMemberJoined=async(memberId)=>{
    console.log("A new member has joind the channel", memberId);
    addMemberToDom(memberId);

    //get the members array length.
    let members=await rtmChannel.getMembers();
    updateMemberTotal(members);

    let {name}=await rtmClient.getUserAttributesByKeys((memberId),["name"])
    addBotMessageToDom(`Welcome to the room ${name} 👋`)
}   

//add the memebers to the UI/DOM.
const addMemberToDom=async(memberId)=>{

    //get the name value from user attributes by name from the room_rtc js.Also destructure the return value.
    let {name}=await rtmClient.getUserAttributesByKeys((memberId),["name"])

    const membersWrapper=document.getElementById("member__list");
    let memberItem= `<div class="member__wrapper" id="member__${memberId}__wrapper">
                        <span class="green__icon"></span>
                        <p class="member_name">${name}</p>
                    </div>`

    membersWrapper.insertAdjacentHTML("beforeend", memberItem);
}
//update total no. of members.
const updateMemberTotal=async(members)=>{
    document.getElementById("members__count").innerText=members.length;
}

//handle user left event
const handleMemberLeft=async(memberId)=>{
    removeMemberFromDom(memberId);
    
    let members=await rtmChannel.getMembers();
    updateMemberTotal(members);

}

//remove the member from the DOM
const removeMemberFromDom=async(memberId)=>{
    let memberWrapper=document.getElementById(`member__${memberId}__wrapper`);

    //returns an HTMLCollection object. So index[0] is the member Name.
    let name=memberWrapper.getElementsByClassName("member_name")[0].textContent;
    memberWrapper.remove();

    //add a bot message when a user leaves.

    addBotMessageToDom(`${name} has left the room.`)
};

//show all channel members to everyone.
const getMembers=async()=>{
    let members=await rtmChannel.getMembers();

    //update the memberList on first load.
    updateMemberTotal(members);
    members.forEach(member=>addMemberToDom(member));
}
//handleChannelMessage function.
const handleChannelMessage=async(messageData, memberId)=>{
    const data=JSON.parse(messageData.text);
    console.log("Message", data);

    //show the message to toher peers.
    if(data.type==='chat'){
        addMemberToDom(data.displayName, data.messageText);
    }
    //if user leaves the stream, leve the user-cotainer from DOM.
    if(data.type==="user_left"){
       document.getElementById(`user-container-${data.uid}`).remove();
    }
    
}


//send messages to the chatroom functionality. it's boradcast to the channel, not p2p.
const sendMessage=async(e)=>{
    e.preventDefault();//message from the form.

    //grab the message value from the form.
    const message=e.target.message.value;
    //send message to the entire channel. sending something to the server: stringify.
    //so that it can be parsed as a JSON on the DOM.
    rtmChannel.sendMessage({text:JSON.stringify({'type':'chat', 'messageText':message,'displayName':displayName})});

    //addmessage to DOM
    addMessageToDom(displayName,message);

    // reset the form after the message is sent.
    e.target.reset();
}
//add new message to dom function.
const addMessageToDom=(name,message)=>{
    let messageWrapper=document.querySelector("#messages");

    let newMessage=` <div class="message__wrapper">
                            <div class="message__body">
                                <strong class="message__author">${name} 👋</strong>
                                <p class="message__text">
                                ${message}
                                </p>
                            </div>
                        </div>`
    messageWrapper.insertAdjacentHTML("beforeend", newMessage);

    //scrollpoistion always the last message sent,
    const lastMessage=document.querySelector("#messages .message__wrapper:last-child");
    if(lastMessage){
        lastMessage.scrollIntoView();

    }
} 

//add bot message to DOM.
const addBotMessageToDom=async(botMessage)=>{

    let messageWrapper=document.querySelector("#messages");

    let newMessage=` <div class="message__wrapper">
                            <div class="message__body__bot">
                                <strong class="message__author__bot">Doordarshan Bot 🤖</strong>
                                <p class="message__text__bot">
                                ${botMessage}
                                </p>
                            </div>
                        </div>`
    messageWrapper.insertAdjacentHTML("beforeend", newMessage);
}

//when the user shuts his computer down.
const leaveChannel=async(e)=>{
    // e.preventDefault();
    await rtmChannel.leave();
    await rtmClient.logout();
}

//ensure the function is called everytime.
window.addEventListener("beforeunload", leaveChannel);
document.getElementById("message__form").addEventListener("submit", sendMessage);
