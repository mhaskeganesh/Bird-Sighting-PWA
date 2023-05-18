const socket = io();

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');
const userName = document.getElementById('name');
const userNameWrapper = document.getElementById('message-name-wrapper');
const messageWrapper = document.getElementById('message-input-wrapper');

function sendmessage(event) {
  event.preventDefault();
  const message = messageInput.value.trim();
  const user = userName.value;
  if (user) {
    userNameWrapper.style.display = 'none';
    messageWrapper.style.display = 'block';
  }

  if (message) {
    socket.emit('message', user, message);
    messageInput.value = '';
    document.getElementById('name').style.display = 'none';
  }
}

socket.on('message', (user, message) => {
  const messageElement = document.createElement('div');
  const paragraph = document.createElement('p');
  paragraph.innerHTML = `<b> ${user}:</b> ${message}`;
  messageElement.appendChild(paragraph);
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
});
