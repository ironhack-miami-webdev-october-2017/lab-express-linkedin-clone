const express        = require('express');
const User           = require('../models/user');
const bcrypt         = require("bcrypt");
const router         = express.Router();
const bcryptSalt     = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username },
  "_id name username password",
  (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
    }
  });
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});


router.post("/signup", (req, res, next) => {
  const {
    username,
    password,
    name,
    email,
    summary,
    imageUrl,
    company,
    jobTitle
    } = req.body;

  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({ "username": username }, "name", (err, user) => {
      if (user !== null) {
        return res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
      }
    })

  if (username === "" || password === "") {
    return res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
  }

  const newUser  = new User({
    username,
    name,
    email,
    summary,
    imageUrl,
    company,
    jobTitle,
    password: hashPass
  });

  newUser.save((err) => {
    req.session.currentUser = newUser;
    res.redirect("/");
  });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy( (err) => {
    if (!err){
      res.redirect('/');
    }
  })
});

module.exports = router;
