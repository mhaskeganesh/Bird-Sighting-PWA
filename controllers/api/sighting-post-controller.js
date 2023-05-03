const SightingPost = require('../../models/sighting_post');
const Identification = require('../../models/identification');

const insertSightingPost = (req, res) => {
  console.log('Reaching till controller');
  const {image, timestamp, location, description, user_nickname, identification, } = req.body;
  const SightingPostObject = new SightingPost({
    image,
    timestamp,
    description,
    user_nickname
  });
  SightingPostObject.save().then(() => {
    console.log('Sighting post saved successfully');
    res.status(200).json({
      message: 'Data saved successfully'
    });
  }).catch((error) => {
    console.log("Something went wrong while saving data to database");
    res.status(500).json({
      message: 'save operation unsucessful'
    });
  })
}

module.exports = {insertSightingPost};