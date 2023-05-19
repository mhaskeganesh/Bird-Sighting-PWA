/*
* Check if the user's browser supports Service Workers and,
* if it does, registers the service worker located at 'service-worker.js'.
* */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

let allPosts = [];
/*
* Handle the upgrade event for the indexedDB database.
* Creates object stores for the postRequests and SavedPosts,
* with keyPath 'id' and autoIncrement set to true.
* Also creates an index for the SavedPosts object store on the '_id' property.
* This index will help in getting filtered data based on _id as key
* @param {Event} event - The upgrade event object.
* */

const handleUpgrade = (event) => {
  const db = event.target.result;
  db.createObjectStore('postRequests', { keyPath: 'id', autoIncrement: true });
  const savedPostObjectStore = db.createObjectStore('SavedPosts', { keyPath: 'id', autoIncrement: true });
  savedPostObjectStore.createIndex('_id', '_id');
};

/**
 Handles the success event of the indexedDB connection.
 */
const handleSuccess = (event) => {
  console.log('indexedDB connection successful: Home Page');
};

/**
 * Handles errors that occur when attempting to connect to IndexedDB in the context of the Home Page.
 */
const handleError = (error) => {
  console.log('indexedDB connection failed: Home Page');
};

/**
 * Initializes the IndexedDB database for the bird sighting app.
 * This function is invoked on page load to open the IndexedDB database and attach the necessary event listeners for
 * creating and upgrading object stores.
 * The IDBOpenDBRequest type object is returned and stored into requestIDB.
 * And this requestIDB object is available globally to access the indexedDB
 */
const requestIDB = (() => {
  const rdb = indexedDB.open('bird-sighting-app-DB', 1);
  rdb.addEventListener('upgradeneeded', handleUpgrade);
  rdb.addEventListener('success', handleSuccess);
  rdb.addEventListener('error', handleError);

  return rdb;
}
)();

/**
 * This method is used to render Card to the DOM
 * Targets the listing-card-wrapper and clones the template
 * Updates the template with the data from the post
 * Adds the event listener to the card
 * Appends it to the listing-card-wrapper
 * @param posts
 */
const renderListingCards = (posts) => {
  console.log(posts);

  // Get card wrapper
  const listingCardWrapper = document.getElementById('listing-card-wrapper');
  listingCardWrapper.innerHTML = '';

  posts.forEach((post) => {
    // Get the card template
    const cardTemplateWrapper = document.getElementById('listing-card-template')
      .cloneNode(true);
    const cardTemplate = cardTemplateWrapper.children[0];

    // Remove the d-none class
    cardTemplateWrapper.classList.remove('d-none');

    // Set the attribute
    cardTemplate.setAttribute('data-id', post._id);

    // Set Event listener
    cardTemplate.addEventListener('click', (event) => {
      console.log('data-id:::', event.currentTarget.getAttribute('data-id'));
      const clickedImageId = event.currentTarget.getAttribute('data-id');
      if (clickedImageId !== null) {
        console.log(`/sighting/?id=${clickedImageId}`);
        window.location.href = `/sighting/?id=${clickedImageId}`;
      }
    });

    // Fill the details
    cardTemplate.firstElementChild.src = post.image;
    cardTemplate.lastElementChild.children[0].innerHTML = post.description;
    cardTemplate.lastElementChild.children[1].innerHTML = post.user_nickname;
    cardTemplate.lastElementChild.children[2].innerHTML = getFormattedDate(post.timestamp);

    // append to wrapper
    listingCardWrapper.appendChild(cardTemplateWrapper);
  });
};

/**
 * This method is used to render the posts to the DOM in descending order based on date added
 */
const sortPostByDescendingOrder = () => {
  // sort allPosts based on timestamp in descending order
  const sortedPosts = allPosts.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB - dateA;
  });

  renderListingCards(sortedPosts);
};

/**
 * This method is used to render the posts to the DOM in ascending order based on date added
 */
const sortPostByAscendingOrder = () => {
  // sort allPosts based on timestamp in ascending order
  const sortedPosts = allPosts.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateA - dateB;
  });
  renderListingCards(sortedPosts);
};

/**
 * Saves up to 5 posts into the SavedPosts object store in indexedDB.
 * Also, previously saved posts are cleared.
 * @param {Array} posts - The array of posts to be saved.
 */
async function savePostsToIndexedDB(posts) {
  try {
    // const simplifiedPosts = posts.slice(0, 5).map(({ _id, image }) => ({ _id, image }));
    renderListingCards(posts);

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
    posts.forEach((post) => {
      savedPostsStore.add(post);
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * This code block fetches all the posts from the server or cache on page load
 * saves them into IndexedDB for offline use, and creates an HTML image element
 * for each post to display it on the page.
 * @param {string} '/get-posts' - The server endpoint to fetch the posts from
 */
fetch('/get-posts')
  .then((response) => response.json())
  .then((posts) => {
    console.log('All posts', posts);
    allPosts = posts;
    savePostsToIndexedDB(posts);
  })
  .catch((error) => console.log(error));
