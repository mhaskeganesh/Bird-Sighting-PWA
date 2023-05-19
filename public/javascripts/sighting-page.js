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
const dataUnavailableMessage = 'Data isnt available / offline';

const setDataById = (id, msg) => {
  document.getElementById(id).innerHTML = msg || dataUnavailableMessage;
};

/**
 *
 * @param postData
 */
const renderPostData = (postData) => {
  // Set the source of the 'sighting-image' element to the value of postData.image
  document.getElementById('sighting-image').src = postData.image;

  // Bird data
  setDataById('bird-name', postData.identification.name);
  setDataById('bird-description', postData.description);

  // Initialize a map with the latitude and longitude values from postData.location
  initMap({
    lat: parseFloat(postData?.location?.latitude),
    lng: parseFloat(postData?.location?.longitude),
  });

  // Iterate over each chat object in postData.chat array
  (postData?.chat || []).forEach((chat) => {
    // Write the user and message to the chat interface
    writeMessageOnChat(chat.user, chat.message);
  });

  // User Data
  setDataById('user-date', getFormattedDate(postData.timestamp));
  setDataById('user-name', postData.user_nickname);
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
    post = postData;
    renderPostData(postData);
  })
  .catch((err) => console.error(err));

const setBirdDetails = () => {
  document.getElementById('bird_modal_title').innerHTML = post.identification.name;
  document.getElementById('bird_modal_description').innerHTML = post.identification.abstract;
};
