const express = require('express');

const router = express.Router();
const { serveSightingPage } = require('../controllers/serve-sighting-page');

router.get('/', serveSightingPage);

module.exports = router;
