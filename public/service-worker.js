const cacheName = 'bird-watching-app-cache';
const assets = [
  '/sighting-post-form',
  '/javascripts/sighting-post-form.js',
  '/javascripts/sighting-page.js',
  '/javascripts/home-page.js',
  '/stylesheets/home-page.css',
  '/sighting/',
  '/',
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

function getFromStore(store, method, id, index) {
  return new Promise((resolve, reject) => {
    console.log('Inside getFromStore', index);
    let request;
    if (method === 'getAll') {
      request = store.getAll();
    } else if (method === 'get') {
      if (index) {
        console.log('Inside index');
        // eslint-disable-next-line no-underscore-dangle
        const _idIndex = store.index(index);
        request = _idIndex.get(id);
      } else {
        request = store.get(id);
      }
    }

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function handleGetSightingDetailRequest(eventRequest) {
  const db = requestIDB.result;
  const transaction = db.transaction(['postRequests', 'SavedPosts'], 'readwrite');
  const postRequestsStore = transaction.objectStore('postRequests');
  const savedRequestsStore = transaction.objectStore('SavedPosts');

  const url = eventRequest.referrer;
  const id = url.substring(url.indexOf('=') + 1);

  let postDetail = null;
  if (id.includes('offid:')) {
    let postId = id.replace(/^offid:/, '');
    // eslint-disable-next-line radix
    postId = parseInt(postId);

    postDetail = await getFromStore(postRequestsStore, 'get', postId);
  } else {
    postDetail = await getFromStore(savedRequestsStore, 'get', id, '_id');
  }
  // eslint-disable-next-line no-debugger
  return new Response(JSON.stringify(postDetail), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleGetPostsRequest(eventRequest) {
  console.log('Inside handleGetPostsRequest');
  // eslint-disable-next-line no-use-before-define
  const db = requestIDB.result;
  const transaction = db.transaction(['postRequests', 'SavedPosts'], 'readwrite');
  // const savedPostsStore = db.transaction('SavedPosts').objectStore('savedPosts');
  const postRequestsStore = transaction.objectStore('postRequests');
  const savedRequestsStore = transaction.objectStore('SavedPosts');
  // const getAllPostsRequest = postRequestsStore.getAll();
  // const postRequests = await postRequestsStore.getAll();

  const [savedPosts, newOfflinePosts] = await Promise.all([
    getFromStore(savedRequestsStore, 'getAll'),
    getFromStore(postRequestsStore, 'getAll'),
  ]);

  // await new Promise ((resolve, reject) => {
  //   getAllPostsRequest.onsuccess = (evt) => {
  //     resolve(evt.target.result);
  //   };
  //   getAllPostsRequest.onerror = function (evt) {
  //     reject(evt.target.error);
  //   };
  // });
  // const sightings = getAllPostsRequest.result.map((post) => {

  const sightings = [...savedPosts, ...newOfflinePosts].map((post) => ({
    // eslint-disable-next-line no-underscore-dangle
    _id: post._id || `offid:${post.id}`,
    image: post.image,
  }));

  console.log(sightings);
  // const response = {
  //   sightings: sightings,
  // };
  console.log('working offline on get-posts END');

  return new Response(JSON.stringify(sightings), {
    headers: { 'Content-Type': 'application/json' },
  });
}

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
    fetch(event.request)
      .then(async (networkResponse) => {
        if (eventRequest.url.indexOf('insert-post') > -1) {
          return networkResponse;
        }
        if (eventRequest.url.indexOf('get-posts') > -1) {
          // const response = handleGetPostsRequest(eventRequest);
          try {
            console.log('GET POST SERVICE WORKER 1');
            const posts = await networkResponse.clone().json();
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
            console.log('GET POST SERVICE WORKER 2');
            simplifiedPosts.forEach((post) => {
              savedPostsStore.add(post);
            });

            console.log('Network response');
            return networkResponse;
          } catch (error) {
            console.log(error);
          }
          return networkResponse;
        } if (eventRequest.url.indexOf('sighting-detail') > -1) {
          console.log('DEBUG...', networkResponse.clone().json().then((res) => {
            console.log('Real check', res);
          }));
          return networkResponse;
        }
        return caches.open(cacheName).then((cache) => {
          if (eventRequest.url.includes('/sighting/')) {
            console.log('Sighting request detected');
            // const cacheKeys = cache.keys();
            // const sightingCacheKey = cacheKeys.find((key) => key.url.includes('/sighting/'));
            // if (!sightingCacheKey) {
            cache.put('/sighting/', networkResponse.clone());
            // }
            return networkResponse;
          }
          cache.put(eventRequest, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(async () => {
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

          return new Response(JSON.stringify({ message: 'success' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          });
        } if (eventRequest.url.indexOf('get-posts') > -1) {
          const response = await handleGetPostsRequest(eventRequest);
          console.log('Reached At End', response);
          return Promise.resolve(response);
        } if (eventRequest.url.indexOf('sighting-detail') > -1) {
          const response = await handleGetSightingDetailRequest(eventRequest);
          // response.clone().json().then((res2) => {
          //   console.log('CHECK', res2);
          // });
          return Promise.resolve(response);
        }
        return caches.open(cacheName)
          .then(async (cache) => {
            if (eventRequest.url.includes('/sighting/')) {
              return cache.match('/sighting/');
            }
            return cache.match(eventRequest);
          })
          .then((response) => {
            if (response) {
              return response;
            }
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
  console.log('INDEXEDDB UPGRADEED');
  const db = event.target.result;
  db.createObjectStore('postRequests', { keyPath: 'id', autoIncrement: true });
  const savedPostObjectStore = db.createObjectStore('SavedPosts', { keyPath: 'id', autoIncrement: true });
  savedPostObjectStore.createIndex('_id', '_id');
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
  console.log('indexedDB launched');
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
