
const sendMsg=document.getElementById("getmsg");
const chat_console=document.getElementById("dchat-console")
var d=new Date();
var time=d.toLocaleString();
document.getElementById("time").innerHTML = time;

function getTime(){
  var d=new Date();
  time=d.toLocaleString();
}
var roomname;
var user=document.getElementById("user_name").innerHTML;
var chatter=document.getElementById("chat_ot").innerHTML;
console.log(user);


// var chatter="Surya";

if(user<chatter){
  roomname=user+chatter;
}

else{
  roomname=chatter+user;
}

const socket=io();
console.log(roomname);
socket.emit("joinRoom",{user,roomname});

socket.on("message",message=>{
  console.log("kkk");
  console.log(message.message);
  addMessage(message);
  //add a js to reach end
})




function addMessage(message){
  const div=document.createElement("div");
  console.log("hiko");
  div.classList.add("dchat");
  if(message.name==user)
    div.innerHTML=`<p class="dchats"><span class="dtime">You<span id="time"></span></span>${message.message}</p>`;
  else

  div.innerHTML=`<div class="dchat"><p class="dchats"><span class="dtime">${message.name}<span id="time"></span></span>${message.message}</p></div>`;
  document.querySelector(".dchat-area").appendChild(div);

};


sendMsg.addEventListener("submit",function(e){
  e.preventDefault();

  const msg=e.target.elements.msg.value;
  console.log(msg);
  socket.emit("chatMessage",msg);
  e.target.elements.msg.value='';
  e.target.elements.msg.focus();
  chat_console.scrollTop=chat_console.scrollHeight;
})
