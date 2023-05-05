/**
 *  Export an object that contains a single function called serveSightingPage.
 *  This function renders a view called 'sighting-page' and sends the rendered content as a response to the client.
 * */
const serveSightingPage = (req, res) => {
  res.render('sighting-page');
};

module.exports = { serveSightingPage };
