if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

const getFormattedDate = (date) => {
  const formattedDate = new Date(date);
  return `${formattedDate.getDate()} ${formattedDate.toLocaleString('default', { month: 'long' })}  ${formattedDate.getFullYear()}`;
}


fetch('/get-posts')
  .then((response) => {
    console.log('HELLO',response);
    return response.json();

  })
  .then((posts) => {
    console.log('.then posts CHECK',posts);
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
        console.log( 'data-id', event.currentTarget.getAttribute('data-id'));
      });

      // Fill the details
      cardTemplate.firstElementChild.src = post.image;
      cardTemplate.lastElementChild.children[0].innerHTML = post.description;
      cardTemplate.lastElementChild.children[1].innerHTML = post.user_nickname;
      cardTemplate.lastElementChild.children[2].innerHTML = getFormattedDate(post.timestamp);

      // append to wrapper
      listingCardWrapper.appendChild(cardTemplateWrapper);
      // const img = document.createElement('img');
      // img.src = post.image;
      // // eslint-disable-next-line no-underscore-dangle
      // img.setAttribute('data-id', post._id);
      // cardTemplate.appendChild(img);

      // imagesContainer.appendChild(img);
    });
  })
  .catch((error) => console.log(error));


// add event listener to each image element
// imagesContainer.forEach((image) => {
//   console.log(image)
//   image.addEventListener('click', (event) => {
//     console.log("Hii")
//     const clickedImageId = event.target.getAttribute('data-id');
//     console.log('Clicked image ID: ', clickedImageId);
//     // send the clickedImageId to the server
//   });
// });
//
