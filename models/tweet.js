'use strict';

var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
  content: String,
  senderId: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  receiverId: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  createdAt: { type: Date, default: Date.now },
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
