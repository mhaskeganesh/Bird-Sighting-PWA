const express = require('express');

const router = express.Router();
const { getPostDetails } = require('../../controllers/api/post-details-controller');

router.post('/', getPostDetails);

module.exports = router;
