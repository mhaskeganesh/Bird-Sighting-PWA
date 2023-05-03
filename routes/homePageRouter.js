const express = require('express');

const router = express.Router();
const { serveHomePage } = require('../controllers/serve-home-page');

router.get('/', serveHomePage);

module.exports = router;
