const User = require('../models/user');

function findUser(req, res, next){
  User.findById(req.params.userId, (err, user) => {
    if (!err && user){
      req.user = user;
    } else {
      return next(err);
    }

    return next()
  });
}

function authorizeUser(req, res, next){
  const { session, params } = req;

  if (typeof(session.currentUser) === 'undefined'){
    res.locals.userLoggedIn = false;
    res.locals.profBelongsToUser = false;
  } else if (session.currentUser && session.currentUser._id === req.params.userId){
    res.locals.userLoggedIn = true;
    res.locals.profBelongsToUser = true;
  } else {
    res.locals.userLoggedIn = true;
    res.locals.profBelongsToUser = false;
  }

  next();
}

function isPrivate(req, res, next){
  const { profBelongsToUser, userLoggedIn } = res.locals;

  if (!userLoggedIn && !profBelongsToUser){
    return res.redirect('/login');
  } else if(userLoggedIn && !profBelongsToUser){
    return res.redirect('/');
  } else {
    return next();
  }
}

module.exports = {
  findUser,
  authorizeUser,
  isPrivate
}
