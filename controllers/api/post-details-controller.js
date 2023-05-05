const SightingPost = require('../../models/sighting_post');

const getPostDetails = async (req, res) => {
  try {
    const { postId } = req.body;
    const postDetails = await SightingPost.findById(postId);
    console.log('post details');
    res.status(200).json(postDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPostDetails };
