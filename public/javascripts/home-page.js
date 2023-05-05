if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

const getFormattedDate = (date) => {
  const formattedDate = new Date(date);
  return `${formattedDate.getDate()} ${formattedDate.toLocaleString('default', { month: 'long' })}  ${formattedDate.getFullYear()}`;
};

fetch('/get-posts')
  .then((response) => response.json())
  .then((posts) => {
    console.log('All posts', posts);

    // Get card wrapper
    const listingCardWrapper = document.getElementById('listing-card-wrapper');

    posts.forEach((post) => {
      // Get the card template
      const cardTemplateWrapper = document.getElementById('listing-card-template').cloneNode(true);
      const cardTemplate = cardTemplateWrapper.children[0];


      // Remove the d-none class
      cardTemplateWrapper.classList.remove('d-none');

      // Set the attribute
      cardTemplate.setAttribute('data-id', post._id);

      // Set Event listener
      cardTemplate.addEventListener('click', (event) => {
        console.log('data-id', event.currentTarget.getAttribute('data-id'));
      });

      // Fill the details
      cardTemplate.firstElementChild.src = post.image;
      cardTemplate.lastElementChild.children[0].innerHTML = post.description;
      cardTemplate.lastElementChild.children[1].innerHTML = post.user_nickname;
      cardTemplate.lastElementChild.children[2].innerHTML = getFormattedDate(post.timestamp);

      // append to wrapper
      listingCardWrapper.appendChild(cardTemplateWrapper);
    });
  })
  .catch((error) => console.log(error));
