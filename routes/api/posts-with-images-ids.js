const express = require('express');

const router = express.Router();
const { getAllPostsWithImagesAndIds } = require('../../controllers/api/post-image-id-controller');

router.get('/', getAllPostsWithImagesAndIds);

module.exports = router;
