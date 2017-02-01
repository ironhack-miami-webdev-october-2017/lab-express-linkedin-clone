const express = require('express');
const User    = require('../models/user');
const router  = express.Router();
const { findUser, authorizeUser, isPrivate } = require('../middleware/user-auth');

router.get('/:userId', [findUser, authorizeUser], (req, res, next) => {
  res.render('profile/show', { user: req.user });
});

router.get('/:userId/edit', [findUser, authorizeUser, isPrivate], (req, res, next) => {
  const { user } = req;

  res.render('profile/edit', { user });
});

router.post('/:userId', [authorizeUser, isPrivate], (req, res, next) => {
  const userFields = {
    username,
    password,
    name,
    email,
    summary,
    imageUrl,
    company,
    jobTitle
  } = req.body;

  User.findByIdAndUpdate(req.params.userId, userFields, (err, user) => {
    if (err){
      return res.render('profile/auth');
    } else {
      return res.redirect(`/profile/${user._id}`);
    }
  });

});

// function findCurrentUser(req, res, next){
//   if (typeof(req.session.currentUser) === 'undefined') { return next(); }
//
//   User.findById(req.session.currentUser._id, (err, user) => {
//     if (!err && user){
//       req.currentUser = user;
//     } else {
//       return res.redirect('/login');
//     }
//     return next()
//   });
// }


function userProjection(req){
  if (typeof(req.session.currentUser) !== 'undefined'){
    return "name username email summary jobTitle company imageUrl"
  } else {
    return "name jobTitle company imageUrl";
  }
}

module.exports = router;
