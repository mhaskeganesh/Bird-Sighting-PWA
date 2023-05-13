/**
 * This code registers the service worker file "service-worker.js" if the browser supports service workers.
 * */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

/**
 * This function is called when a user submits a form for inserting a new post.
 * It first prevents the default form submission behavior.
 * It then creates a FormData object from the form data and extracts the base64 encoded image data from the image element's dataset.
 * It constructs a data object with the required data fields for the post and sends a POST request to the server with the data as JSON payload.
 * If the response status is 200, it displays a success message.
 * If there is any error, it logs the error message to the console.
 */
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const dataBody = {
    image: document.getElementById('bird_image').dataset.base64,
    timestamp: formData.get('date'),
    description: formData.get('description'),
    user_nickname: formData.get('user_nickname'),
  };
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  fetch('/insert-post', {
    method: 'POST',
    headers,
    body: JSON.stringify(dataBody),
    // eslint-disable-next-line consistent-return
  }).then((response) => {
    if (response.status === 200) {
      // Add redirection in the later stage to detail page
      window.location.href = '/';
      // return response.json();
      alert('Data saved successfully');
    }
  }).catch((error) => {
    console.log('error in insert-post fetch', error);
  });
}

// eslint-disable-next-line no-unused-vars
/**
 * This function is triggered when an image is uploaded by the user.
 * It reads the file data using FileReader API and converts it into a base64-encoded string
 * that is stored in the dataset of the HTML element with ID 'bird_image'.
 */
function imageUploaded() {
  const file = document.getElementById('bird_image').files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const base64String = reader.result;
    document.getElementById('bird_image').dataset.base64 = base64String;
  };
  reader.readAsDataURL(file);
}
