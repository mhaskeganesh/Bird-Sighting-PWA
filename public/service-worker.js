const cacheName = 'bird-watching-app-cache';
const assets = [
  '/sighting-post-form',
  '/javascripts/sighting-post-form.js',
];

// service worker "install" event listener
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        cache.addAll(assets).then(() => {
          console.log('assets cached successfully');
        });
      })
      .catch((error) => {
        console.log('Error while caching assets', error);
      }),
  );
});

// service worker "activate" event listener
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key !== cacheName)
        .map((key) => caches.delete(key)))),
  );
});

async function saveRequestToIndexedDB(request) {
  console.log('Inside save ...function');
  const requestBody = await request.json();

  // eslint-disable-next-line no-use-before-define
  const postInsertRequestDB = requestIDB.result;
  const transaction = postInsertRequestDB.transaction(['postRequests'], 'readwrite');
  const postRequestsStore = transaction.objectStore('postRequests');
  console.log('Saving post in indexedDB  start...');
  // const requestClone = request.clone();
  const addRequest = postRequestsStore.add(requestBody);

  await new Promise((resolve, reject) => {
    addRequest.onsuccess = function (event) {
      console.log('Post saved in indexedDB successfully.');
      resolve(event.target.result);
    };

    addRequest.onerror = function (event) {
      console.error('Error saving post in indexedDB', event.target.error);
      reject(event.target.error);
    };
  });

  return addRequest.result;
}

// fetch event with traditional .then() chain implementation
// eslint-disable-next-line no-restricted-globals
// fetch event listener
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
  const eventRequest = event.request.clone();
  console.log('Reaching to service worker');
  event.respondWith(
    fetch(event.request).catch(async () => {
      if (eventRequest.url.indexOf('insert-post') > -1) {
        const postIndexedDBID = await saveRequestToIndexedDB(eventRequest);
        // eslint-disable-next-line no-use-before-define
        registerSyncEvent(`insert-post-sync-${postIndexedDBID}`)
          .then(() => {
            console.log('sync event registered successfully');
          })
          .catch((error) => {
            console.log('sync event registration failed: ', error);
          });

        return caches.open(cacheName)
          .then((cache) => cache.match('/sighting-post-form'));
      }
      return caches.open(cacheName)
        .then((cache) => cache.match(eventRequest))
        .then((response) => {
          // If a cached response is available, return it
          if (response) {
            return response;
          }
          // Otherwise, return a network error response
          return new Response('Network unavailable', { status: 503 });
        });
    }),
  );
});

// Function to save the request body into IndexedDB

// Function to register a sync event
function registerSyncEvent(tag) {
  // Check if the browser supports sync events
  // eslint-disable-next-line no-restricted-globals
  if ('SyncManager' in self) {
    // Register a sync event with the given tag
    // eslint-disable-next-line no-restricted-globals
    return self.registration.sync.register(tag);
  }
  // Sync events are not supported, so return a rejected Promise
  return Promise.reject(new Error('Sync events are not supported'));
}

// Function to serialize headers into a plain object
// function serializeHeaders(headers) {
//   const serialized = {};
//   headers.forEach((value, key) => {
//     serialized[key] = value;
//   });
//   return serialized;
// }

const handleUpgrade = (event) => {
  const db = event.target.result;
  db.createObjectStore('postRequests', { keyPath: 'id', autoIncrement: true });
};

// handle success event on indexedDB connection
const handleSuccess = () => {
  console.log('indexedDB connection successful');
};

const handleError = () => {
  console.log('indexedDB connection failed');
};

// Open a connection to an IndexedDB database called "birdSightingAppDB" with version number 1
const requestIDB = (() => {
  const birdSightingAppDB = indexedDB.open('bird-sighting-app-DB', 1);

  // eslint-disable-next-line max-len
  // Attach event listeners to the IndexedDB open request to handle the upgrade, success, and error events
  birdSightingAppDB.addEventListener('upgradeneeded', handleUpgrade);
  birdSightingAppDB.addEventListener('success', handleSuccess);
  birdSightingAppDB.addEventListener('error', handleError);

  // Return the IndexedDB open request
  return birdSightingAppDB;
})();

function deleteRecordFromIndexDB(objectStore, key) {
  const postInsertRequestDB = requestIDB.result;
  const transaction = postInsertRequestDB.transaction([objectStore, 'readwrite']);
  const postRequestsStore = transaction.objectStore(objectStore);
  postRequestsStore.delete(key);
}
// eslint-disable-next-line no-restricted-globals
self.addEventListener('sync', (event) => {
  if (event.tag.indexOf('insert-post-sync') > -1) {
    // eslint-disable-next-line no-debugger
    console.log('sync triggered');
    const postInsertRequestDB = requestIDB.result;
    const transaction = postInsertRequestDB.transaction(['postRequests'], 'readwrite');
    const postRequestsStore = transaction.objectStore('postRequests');
    const postKey = parseInt(event.tag.substring(event.tag.lastIndexOf('-') + 1), 10);
    const postIdRequest = postRequestsStore.get(postKey);

    postIdRequest.onsuccess = (evt) => {
      const post = evt.target.result;

      const dataBody = {
        image: post.image,
        timestamp: post.timestamp,
        description: post.description,
        user_nickname: post.user_nickname,
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
          console.log('Offline Posts Saved Successfully');
          // deleteRecordFromIndexDB('postRequests', post.id);
          const transaction2 = postInsertRequestDB.transaction(['postRequests'], 'readwrite');
          const postRequestsStore2 = transaction2.objectStore('postRequests');
          postRequestsStore2.delete(post.id);
          return response.json();
        }
      }).catch((error) => {
        console.log('Error occurred while saving offline posts', error);
      });
    };
  }
});