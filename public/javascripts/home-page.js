/*
* Check if the user's browser supports Service Workers and,
* if it does, registers the service worker located at 'service-worker.js'.
* */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

const imagesContainer = document.querySelector('#images-container');


/**

 Handle the upgrade event for the indexedDB database.
 Creates object stores for the postRequests and SavedPosts,
 with keyPath 'id' and autoIncrement set to true.
 Also creates an index for the SavedPosts object store on the '_id' property.
 @param {Event} event - The upgrade event object.
 */
const handleUpgrade = (event) => {
  const db = event.target.result;
  db.createObjectStore('postRequests', { keyPath: 'id', autoIncrement: true });
  const savedPostObjectStore = db.createObjectStore('SavedPosts', { keyPath: 'id', autoIncrement: true });
  savedPostObjectStore.createIndex('_id', '_id');
};

const handleSuccess = (event) => {
  console.log('indexedDB connection successful: Home Page');
};

const handleError = (error) => {
  console.log('indexedDB connection failed: Home Page');
};

const requestIDB = (() => {
  const rdb = indexedDB.open('bird-sighting-app-DB', 1);
  rdb.addEventListener('upgradeneeded', handleUpgrade);
  rdb.addEventListener('success', handleSuccess);
  rdb.addEventListener('error', handleError);

  return rdb;
}
)();
async function savePostsToIndexedDB(posts) {
  console.log('Home Page: ', posts);
  try {
    const simplifiedPosts = posts.slice(0, 5).map(({ _id, image }) => ({ _id, image }));

    // save the new array of objects to indexedDB
    // eslint-disable-next-line no-use-before-define
    const db = requestIDB.result;
    const transaction = db.transaction(['SavedPosts'], 'readwrite');
    const savedPostsStore = transaction.objectStore('SavedPosts');

    const deleteAllRequest = savedPostsStore.clear();
    await new Promise((resolve) => {
      deleteAllRequest.onsuccess = resolve;
      deleteAllRequest.onerror = resolve;
    });
    simplifiedPosts.forEach((post) => {
      savedPostsStore.add(post);
    });
  } catch (error) {
    console.log(error);
  }
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
  if (clickedImageId !== null) {
    window.location.href = `/sighting/?id=${clickedImageId}`;
  }
});
