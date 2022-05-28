//handle memeber joined.

const handleMemberJoined=async(memberId)=>{
    console.log("A new member has joind the channel", memberId);
    addMemberToDom(memberId);
}   

//add the memebers to the UI/DOM.
const addMemberToDom=async(memberId)=>{

    const membersWrapper=document.getElementById("member__list");
    let memberItem= `<div class="member__wrapper" id="member__${memberId}__wrapper">
                        <span class="green__icon"></span>
                        <p class="member_name">${memberId}</p>
                    </div>`

    membersWrapper.insertAdjacentHTML("beforeend", memberItem);
}
