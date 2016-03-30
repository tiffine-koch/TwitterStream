// 'use strict';
// var express = require('express');
// var router = express.Router();
// var User = require('../models/user');
// var Twitter = require('twitter');
// require('dotenv').config();
//
//
// var client = new Twitter({
//   consumer_key: process.env.API_KEY,
//   consumer_secret: process.env.API_SECRET,
//   access_token_key: process.env.ACCESS_KEY,
//   access_token_secret: process.env.ACCESS_SECRET,
// });
//
// function findTweets(interests) {
//
//   client.stream('statuses/filter', {track: interests.join()},  function(stream){
//     stream.on('data', function(tweet) {
//       console.log('user: ', tweet.user.screen_name);
//       console.log('tweet: ', tweet.text);
//     });
//
//     stream.on('error', function(error) {
//       console.log(error);
//     });
//   });
// }
//
// router.get('/', User.authMiddleWare, function(req, res) {
//   var interests = req.user.interests;
//   findTweets(interests);
//   res.send();
// })
//
// router.get('/stop', function(req, res) {
//   findTweets(null);
//   res.send();
// })
//
//
// module.exports = router;
