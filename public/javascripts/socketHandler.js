let socket = io();

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');


function sendmessage(event) {
    event.preventDefault();
    const message = messageInput.value.trim();
    console.log(message);
    const user = document.getElementById("name").value;

    if (message) {
        socket.emit('message', user, message);
        messageInput.value = '';
        document.getElementById("name").style.display = "none";

    }
}

socket.on('message', (user,message) => {
    const messageElement = document.createElement('div');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = `<b> ${user}:</b> `+ message;
    messageElement.appendChild(paragraph);
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight

});
