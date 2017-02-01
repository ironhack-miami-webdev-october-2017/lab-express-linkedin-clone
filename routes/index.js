const express = require('express');
const Post    = require('../models/post');
const router  = express.Router();
const { findUser, authorizeUser } = require('../middleware/user-auth');

/* GET home page. */
router.get('/', [findUser, authorizeUser], (req, res, next) => {
  let { currentUser } = req.session;

  Post
  .find({})
  .populate('_creator')
  .exec( (err, posts) => {
    if (err) { return next(err); }
    return res.render('index', {
      currentUser,
      posts: posts
    });
  });

});

module.exports = router;
