const express = require('express');
const router = express.Router();
const { insertSightingPost } = require('../../controllers/api/sighting-post-controller');

router.post('/', insertSightingPost);

module.exports = router;
