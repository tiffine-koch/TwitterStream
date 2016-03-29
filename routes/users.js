var express = require('express');
var router = express.Router();

var User = require('../models/user');

//route to get all users
router.get('/usernames', User.authMiddleWare, function(req, res) {
  User.find({_id: {$ne: req.user._id}}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users);
  }).select('username');
});


router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users);
  });
});

router.get('/profile', User.authMiddleWare, function(req, res) {
  res.send(req.user);
});

router.post('/register', function(req, res) {
  User.register(req.body, function(err, user) {
    if(err) {
      res.status(400).send(err);
    } else {
      var token = user.generateToken();
      res.cookie('tiffcookie', token).send(user);
    }
  });
});

router.post('/authenticate', function(req, res) {
  User.authenticate(req.body, function(err, user) {
    if(err) {
      res.status(400).send(err);
    } else {
      var token = user.generateToken();
      res.cookie('tiffcookie', token).send(user);
    }
  });
});


router.delete('/logout', function(req, res) {
  res.clearCookie('tiffcookie').send();
});

module.exports = router;
