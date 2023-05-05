/**
 * This code registers the service worker file "service-worker.js" if the browser supports service workers.
 * */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

// Get the id parameter from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
// This variable will be used to store the post details.
let post = null;
// Offline message string
const dataUnavailableMessage = 'Data isnt avaiable / offline';

/**
 * * This function sends a POST request to the server with the postId to fetch the details of the selected sighting
 * It updates the post details on the DOM once the response is received
*/
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
