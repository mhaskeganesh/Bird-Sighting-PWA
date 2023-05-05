if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

// const postIdInput = document.getElementById('post_id');
// const postId = postIdInput.value;

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
console.log(`postId: ${postId}`);
console.log(postId);
let post = null;
const dataUnavailableMessage = 'Data isnt avaiable / offline'
fetch('/sighting-detail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ postId }),
})
  .then((res) => res.json())
  .then((postData) => {
    post = postData;
    document.getElementById('sighting-image').src = postData.image;
    document.getElementById('date').innerHTML = postData.timestamp || dataUnavailableMessage;
    document.getElementById('desc').innerHTML = postData.description || dataUnavailableMessage;
    document.getElementById('username').innerHTML = postData.user_nickname || dataUnavailableMessage;
  })
  .catch((err) => console.error(err));
