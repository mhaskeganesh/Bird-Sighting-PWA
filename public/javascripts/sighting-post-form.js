/**
 * This code registers the service worker file "service-worker.js" if the browser supports service workers.
 * */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

const setErrorMessage = (msg) => {
  const alertMessage = document.getElementById('error-message');

  alertMessage.style.display = 'block';
  alertMessage.innerHTML = msg;

  // scroll to top
  window.scrollTo(0, 0);
};

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

  // eslint-disable-next-line
  let latitude, longitude, birdName, dbpediaUri
  // Process Identification
  let processedIdentification = formData.get('identification');
  if (processedIdentification && processedIdentification !== '') {
    processedIdentification = processedIdentification.split(';');
    [dbpediaUri, birdName] = processedIdentification;
  } else {
    return setErrorMessage('Please select a bird name');
  }

  // Process Location;
  let processedLocation = formData.get('location_data');
  if (processedLocation && processedLocation !== '') {
    processedLocation = processedLocation.split(';');
    [latitude, longitude] = processedLocation;
  } else {
    return setErrorMessage('Please select a location');
  }

  const dataBody = {
    image: document.getElementById('bird_image').dataset.base64,
    timestamp: formData.get('date'),
    description: formData.get('description'),
    user_nickname: formData.get('user_nickname'),
    location: {
      latitude,
      longitude,
    },
    identification: {
      name: birdName,
      dbpedia_uri: dbpediaUri,
    },
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

const sparqlQuery = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dbo: <http://dbpedia.org/ontology/>
  
  SELECT ?bird ?name
  WHERE 
  {
    ?bird rdf:type dbo:Bird .
    ?bird rdfs:label ?name .
    FILTER (lang(?name) = "en")
  }
`;

const sparqlEndpoint = 'http://dbpedia.org/sparql';

async function getBirds() {
  try {
    const response = await fetch(`${sparqlEndpoint}?query=${encodeURIComponent(sparqlQuery)}&format=json`);
    const data = await response.json();
    const birds = data.results.bindings.map((binding) => ({
      value: `${binding.bird.value};${binding.name.value}`,
      label: binding.name.value,
    }));
    return birds;
  } catch (error) {
    console.error(error);
  }
}

const initiateChoices = () => {
  const element = document.querySelector('#identification');
  // Added via CDN
  const choices = new Choices(element, {
    shouldSort: false,
    shouldSortItems: false,
    renderChoiceLimit: 10,
  });
  choices.setChoices(async () => await getBirds());
};

window.onload = () => {
  initiateChoices();
};
