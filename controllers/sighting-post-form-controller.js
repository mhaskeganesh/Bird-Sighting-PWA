/**
 * This is a function that serves the sighting post form view to the client. The function is exported as an object with a single property called serveSightPostForm.
 * When invoked, the function renders the sighting-post-form view and sends it as a response to the client.
 * */
const serveSightPostForm = (req, res) => {
  res.render('sighting-post-form');
};

module.exports = { serveSightPostForm };
