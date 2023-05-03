// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
// eslint-disable-next-line no-unused-vars
function handleSubmit(event) {
  console.log('inside handle submit');
  event.preventDefault();

  console.log('Inside handleSubmit base64: ', document.getElementById('bird_image').dataset.base64);

  const form = event.target;
  const formData = new FormData(form);
  console.log('form data', formData);

  const dataBody = {
    image: document.getElementById('bird_image').dataset.base64,
    timestamp: formData.get('date'),
    description: formData.get('description'),
    user_nickname: formData.get('user_nickname'),
  };
  console.log(JSON.stringify(dataBody));
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  fetch('/insert-post', {
    method: 'POST',
    headers,
    body: JSON.stringify(dataBody),
    // eslint-disable-next-line consistent-return
  }).then((response) => {
    if (response.status === 200) {
      alert('Data saved successfully');
      // return response.json();
    }
    console.log('Something went wrong...');
  }).catch((error) => {
    console.log('error in insert-post fetch', error);
  });
}

// eslint-disable-next-line no-unused-vars
function imageUploaded() {
  const file = document.getElementById('bird_image').files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const base64String = reader.result;
    console.log(base64String);
    document.getElementById('bird_image').dataset.base64 = base64String;
  };
  reader.readAsDataURL(file);
}
