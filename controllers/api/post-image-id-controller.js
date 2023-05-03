const SightingPost = require('../../models/sighting_post');

const getAllPostsWithImagesAndIds = async (req, res) => {
  console.log('Reached inside fetch posts');
  try {
    const posts = await SightingPost.find({}, { image: 1, _id: 1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllPostsWithImagesAndIds };
