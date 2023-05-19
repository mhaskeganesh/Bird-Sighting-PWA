/**
 * Retrieves the details of a post specified by the postId and
 * sends it as a response in JSON format.
 * */
const SightingPost = require('../../models/sighting_post');

const getPostDetails = async (req, res) => {
  try {
    const { postId } = req.body;
    const postDetails = await SightingPost.findById(postId);
    res.status(200).json(postDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPostDetails };
