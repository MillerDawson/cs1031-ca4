//required for front end communication between client and server

const socket = io();

const inboxPeople = document.querySelector(".inbox__people");

var typing=false;
var timeout=undefined;
var user;

let userName = "";
let id;
const newUserConnected = function (data) {
    

    //give the user a random unique id
    id = Math.floor(Math.random() * 1000000);
    userName = 'user-' +id;
    //console.log(typeof(userName));   
    

    //emit an event with the user id
    socket.emit("new user", userName);
    //call
    addToUsersBox(userName);
};

const addToUsersBox = function (userName) {
    //This if statement checks whether an element of the user-userlist
    //exists and then inverts the result of the expression in the condition
    //to true, while also casting from an object to boolean
    if (!!document.querySelector(`.${userName}-userlist`)) {
        return;
    }
    
    //setup the divs for displaying the connected users
    //id is set to a string including the username
    const userBox = `
    <div class="chat_id ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
    //set the inboxPeople div with the value of userbox
    inboxPeople.innerHTML += userBox;
};

//call 
newUserConnected();

//when a new user event is detected
socket.on("new user", function (data) {
  data.map(function (user) {
          return addToUsersBox(user);
      });

// mChat Connect Message
  messageBox.innerHTML += serverConnectMsg;
});

//when a user leaves
socket.on("user disconnected", function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();

// mChat Disconnect Message
  messageBox.innerHTML += serverDisconnectMsg;
});

const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");

const time = new Date();
const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

const addNewMessage = ({ user, message }) => {

  // Message recieved by user
  const receivedMsg = `
  <div class="incoming__message">
    <div class="received__message">
    <div class="message__info">
    <p class="time_date">${formattedTime}</p>
        <span class="message__author">${user}</span><br>
        <span class="description-text">${message}</span>
    </div>
    </div>
  </div>`;

  // Message sent by user
  const myMsg = `
  <div class="outgoing__message">
    <div class="sent__message">
    <div class="message__info">
    <p class="time_date">${formattedTime}</p>
        <span class="message__user">${userName}</span><br>
        <span class="description-text">${message}</span>
    </div>
    </div>
  </div>`;

  //is the message sent or received
  messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
};

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputField.value) {
    return;
  }

  socket.emit("chat message", {
    message: inputField.value,
    nick: userName,
  });

  inputField.value = "";
});

socket.on("chat message", function (data) {
  addNewMessage({ user: data.nick, message: data.message });
});


/* chat connect/disconnect messages */
const serverConnectMsg = `
<div class="outgoing__message">
    <div class="sent__message">
    <div class="message__info">
    <p class="time_date">${formattedTime}</p>
        <span class="message__author">mChat</span><br>
        <span class="description-text">${userName} has joined the chat</span>
    </div>
    </div>
  </div>`;


const serverDisconnectMsg = `
<div class="outgoing__message">
    <div class="sent__message">
    <div class="message__info">
    <p class="time_date">${formattedTime}</p>
        <span class="message__author">mChat</span><br>
        <span class="description-text">${userName} has left the chat</span>
    </div>
    </div>
  </div>`;

/* 
Typing ~ 
https://rsrohansingh10.medium.com/add-typing-in-your-chat-application-using-socket-io-421c12d8859e
*/

inputField.addEventListener('keypress', () =>{
  socket.emit('isTyping', data)
})

socket.on('keypress', (data) => {
    typingStatus = true
    socket.emit('isTyping', {
        user: user,
        typingStatus: true
    })
    clearTimeout(timeout)
    timeout = setTimeout(typingTimeout, 3000)
})

socket.on('isTyping', (data) => {
	if (data.isTyping == True)
		status.innerHTML += ("<p>${userName} is typing</p>")
	else
		/* leaves .typingStatus empty if the user is not typing */
		status.innerHTML += ("")
})