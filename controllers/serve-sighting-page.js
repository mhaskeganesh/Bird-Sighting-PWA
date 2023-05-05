const serveSightingPage = (req, res) => {
  // const { id } = req.query;
  // if (!id) {
  //   res.send('Invalid Entry');
  //   return;
  // }
  // console.log('id', id);
  // res.render('sighting-page', { postId: id });
  res.render('sighting-page');
};

module.exports = { serveSightingPage };
