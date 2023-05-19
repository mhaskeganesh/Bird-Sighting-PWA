const socket = io();

// Get DOM Elements
const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');
const userName = document.getElementById('name');
const userNameForm = document.getElementById('userNameForm');
const messageForm = document.getElementById('messageForm');

/**
 * This function is used to write the message on the chat interface.
 *
 * @param user
 * @param message
 * @param isUser
 */
function writeMessageOnChat(user, message, isUser) {
  const messageElement = document.createElement('div');
  const paragraph = document.createElement('p');
  if (isUser) {
    paragraph.classList.add(['text-end']);
    paragraph.classList.add(['me-4']);
  }

  paragraph.innerHTML = `<b> ${user}:</b> ${message}`;
  messageElement.appendChild(paragraph);
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}

/**
 * This function is used to get the URL search parameters.
 * @returns {*}
 */
const getPageID = () => {
  const searchParams = getURLSearchParms();
  return searchParams?.id;
};

/**
 * This function is used to send message and emit the message event.
 * It also writes the message on the chat interface.
 * @param event
 */
function sendMessage(event) {
  event.preventDefault();
  const message = messageInput.value.trim();
  const user = userName.value;
  const pageID = getPageID();

  if (message) {
    socket.emit('message', pageID, user, message);
    writeMessageOnChat(user, message, true);
    messageInput.value = '';
    document.getElementById('name').style.display = 'none';
  }
}

/**
 * This function is used to emit the create or join event.
 * @param event
 */
function connectToRoom(event) {
  event.preventDefault();
  const pageID = getPageID();

  socket.emit('create or join', pageID, userName);
  userNameForm.style.display = 'none';
  messageForm.style.display = 'block';
}

/**
 * This function is used to initialize the chat methods.
 */
function chatInit() {
  socket.on('joined', (room, pageID) => {
    console.log(room, pageID);
  });

  socket.on('message', (pageID, user, message) => {
    console.log('client message', user, message);
    writeMessageOnChat(user, message);
  });
}

document.onload = chatInit();
