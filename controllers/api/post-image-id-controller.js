/**
 * Retrieves all sighting posts with images and IDs from the database.
 * */
const SightingPost = require('../../models/sighting_post');

const getAllPostsWithImagesAndIds = async (req, res) => {
  try {
    const posts = await SightingPost.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllPostsWithImagesAndIds };
