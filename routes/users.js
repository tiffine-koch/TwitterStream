'use strict';

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
require('dotenv').config();

var Twitter = require('twitter');
var User = require('../models/user');

router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users);
  });
});

router.get('/usernames', User.authMiddleWare, function(req, res) {
  User.find({_id: {$ne: req.user._id}}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users);
  }).select('username');
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

router.post("/logout", function(req, res) {
  res.clearCookie("tiffcookie").send();
})

router.put('/interests', User.authMiddleWare, function(req, res) {
  User.findByIdAndUpdate(req.user._id, {
      $push: req.body
    },
  function(err, user) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(user);
    }
  });
});

router.delete('/interests/:index', User.authMiddleWare, function(req, res) {
  User.findById(req.user._id, function(err, dbUser) {
    if(err) return res.status(400).send(err);
    dbUser.interests.splice(req.params.index, 1);
    dbUser.save(function(err, savedUser) {
      if(err) res.status(400).send(err);
      res.send(savedUser);
    })
  })
})

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

router.get("/tweets",  User.authMiddleWare, function(req, res) {
  console.log('inside route');
  var interests = req.user.interests;
  interests.forEach(function(interest) {
    console.log('interest', interest);
    client.stream('statuses/filter', {track: interest}, function(stream) {
      stream.on('data', function(tweet) {
        console.log(tweet);
        console.log(tweet.text);
      });
      stream.on('error', function(error) {
        throw error;
      });
    });
  });
  res.send();
});

router.get('/stop', function(req, res) {
  findTweets(null);
  res.send();
})

module.exports = router;
