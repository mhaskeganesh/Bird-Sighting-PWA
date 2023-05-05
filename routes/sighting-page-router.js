/**
 * This code exports an instance of an Express router that handles HTTP GET requests to the root URL path '/sighting'.
 * When a GET request is received, the 'serveSightingPage' function from the '../controllers/serve-sighting-page' module is called to generate and send a response back to the client.
 * This router is intended to be mounted as middleware in an Express application to handle routing to the sighting page.
 * */
const express = require('express');

const router = express.Router();
const { serveSightingPage } = require('../controllers/serve-sighting-page');

router.get('/', serveSightingPage);

module.exports = router;
