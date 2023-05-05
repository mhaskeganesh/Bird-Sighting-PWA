/**
 * This is a basic router file for an Express app. It exports a router object that handles HTTP GET requests to the app's root path ('/').
 * When a GET request is made, the router sends a response that renders a view template called 'index', passing a data object that includes a property called 'title' with the value 'Express'.
 * */

const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
