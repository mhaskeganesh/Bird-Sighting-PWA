/**
 * This code exports a router object that handles GET requests to the root route of a web application.
 * When a user accesses this route- /sighting-post-form,
 * it calls the serveSightPostForm function from sighting-post-form-controller to serve a web page containing a form for submitting a new bird sighting post.
 * */

const express = require('express');

const router = express.Router();
const { serveSightPostForm } = require('../controllers/sighting-post-form-controller');

router.get('/', serveSightPostForm);

module.exports = router;
