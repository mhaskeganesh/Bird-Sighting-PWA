if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

const imagesContainer = document.querySelector('#images-container');

const handleUpgrade = (event) => {
  console.log(indexDB upgraded: Home Page);
}

const handleSuccess = (event) => {
  console.log('indexedDB connection successful: Home Page');
}

const handleError = (error) => {
  console.log('indexedDB connection failed: Home Page');
}

const requestDB = (() => {
  const rdb = indexedDB.open('SavedPosts', 1);
  rdb.addEventListener('upgradeneeded', handleUpgrade);
  rdb.addEventListener('success', handleSuccess);
  rdb.addEventListener('error', handleError);

  return rdb;
}
)();
function savePostsToIndexedDB(posts) {
  console.log(posts);
}

fetch('/get-posts')
  .then((response) => {
    console.log('HELLO', response);
    return response.json();
  })
  .then((posts) => {
    console.log('.then posts CHECK', posts);
    savePostsToIndexedDB(posts);
    posts.forEach((post) => {
      const img = document.createElement('img');
      img.src = post.image;
      // eslint-disable-next-line no-underscore-dangle
      // const id = post._id || post.id;
      // img.setAttribute('data-id', id);
      img.setAttribute('data-id', post._id);
      imagesContainer.appendChild(img);
    });
  })
  .catch((error) => console.log(error));

// add event listener to each image element
imagesContainer.addEventListener('click', (event) => {
  const clickedImageId = event.target.getAttribute('data-id');
  console.log('Clicked image ID: ', clickedImageId);
  // send the clickedImageId to the server
  window.location.href = `/sighting/?id=${clickedImageId}`;
});
