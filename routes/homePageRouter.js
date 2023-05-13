/**
 * This code defines a router for handling HTTP GET requests to the root path ("/").
 * It imports the "serveHomePage" function from "../controllers/serve-home-page" and
 * uses it as the request handler for GET requests to the root path.
 * Finally, it exports the router as a module.
 * */
const express = require('express');

const router = express.Router();
const { serveHomePage } = require('../controllers/serve-home-page');

router.get('/', serveHomePage);

module.exports = router;
