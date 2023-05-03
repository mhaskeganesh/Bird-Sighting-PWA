const express = require('express');
const router = express.Router();
const { serveSightPostForm } = require('../controllers/sighting-post-form-controller');

router.get('/', serveSightPostForm);

module.exports = router;


