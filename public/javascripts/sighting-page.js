/**
 * This code registers the service worker file "service-worker.js" if the browser supports service workers.
 * */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
// TODO: Refactor the google map init
// Get the id parameter from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
// This variable will be used to store the post details.
const post = null;
// Offline message string
const dataUnavailableMessage = 'Data isnt available / offline';

const setDataById = (id, msg) => {
  document.getElementById(id).innerHTML = msg || dataUnavailableMessage;
};

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
    document.getElementById('sighting-image').src = postData.image;

    // Bird data
    setDataById('bird-name', postData.identification.name);
    setDataById('bird-description', postData.description);

    initMap({
      lat: parseFloat(postData?.location?.latitude),
      lng: parseFloat(postData?.location?.longitude),
    });

    (postData?.chat || []).forEach((chat) => {
      writeMessageOnChat(chat.user, chat.message);
    });
    // User Data
    setDataById('user-date', getFormattedDate(postData.timestamp));
    setDataById('user-name', postData.user_nickname);
  })
  .catch((err) => console.error(err));
