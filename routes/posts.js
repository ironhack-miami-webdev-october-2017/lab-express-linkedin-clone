const Post    = require('../models/post');
const User    = require('../models/user');
const express = require('express');

const router  = express.Router();
const { findUser, authorizeUser, isPrivate } = require('../middleware/user-auth');

router.get('/:userId/posts/new', [findUser, authorizeUser, isPrivate], (req, res, next) => {
  res.render('posts/new', { user: req.user });
});

router.post('/:userId/posts', [findUser, authorizeUser, isPrivate], (req, res, next) => {
  const myPost = new Post({
    content: req.body.content,
    _creator: req.user._id
  });

  myPost.save( (err) => {
    if (err){
      return res.render('posts/new', { user: req.user });
    } else {
      req.user.posts.push(myPost);
      req.user.save( (err) => {
        if (err){
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });
});

module.exports = router;
