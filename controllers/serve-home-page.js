/**
 * Serves the home page to client
 * */
const serveHomePage = (req, res) => {
  res.render('home-page');
};

module.exports = { serveHomePage };
