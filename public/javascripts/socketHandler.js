const socket = io();

const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');
const userName = document.getElementById('name');
const userNameWrapper = document.getElementById('message-name-wrapper');
const messageWrapper = document.getElementById('message-input-wrapper');

const userNameForm = document.getElementById('userNameForm');
const messageForm = document.getElementById('messageForm');

const getPageID = () => {
  const searchParams = getURLSearchParms();
  return searchParams?.id;
};

function sendMessage(event) {
  event.preventDefault();
  const message = messageInput.value.trim();
  const user = userName.value;
  const pageID = getPageID();

  if (message) {
    socket.emit('message', pageID, user, message);
    messageInput.value = '';
    document.getElementById('name').style.display = 'none';
  }
}

function connectToRoom(event) {
  event.preventDefault();
  const pageID = getPageID();

  socket.emit('create or join', pageID, userName);
  userNameForm.style.display = 'none';
  messageForm.style.display = 'block';
}

function chatInit() {
  socket.on('joined', (room, pageID) => {
    console.log(room, pageID);
  });

  socket.on('message', (pageID, user, message) => {
    console.log('client message', user, message);
    const messageElement = document.createElement('div');
    const paragraph = document.createElement('p');
    paragraph.innerHTML = `<b> ${user}:</b> ${message}`;
    messageElement.appendChild(paragraph);
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
  });
}

document.onload = chatInit();
