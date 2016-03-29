'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');

const JWT_SECRET = 'this is my SUPER secret';
var User;

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  interests: [{type: String}]
  // interests: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweets'}]
});

userSchema.statics.authMiddleWare = function(req, res, next) {
    var token = req.cookies.tiffcookie;
    console.log("token", token);
    try {
      var payload = jwt.decode(token, JWT_SECRET);
    } catch (err) {
      console.log('err:', err);
      return res.clearCookie('tiffcookie').status(401).send();
    }
    User.findById(payload.userId).select({password: 0}).exec(function(err, user) {
      if(err || !user) {
        return res.clearCookie('tiffcookie').status(401).send(err);
      }
    req.user = user; //making the user document available to the route
    next();
    })
  }

userSchema.statics.register = function(userObj, cb) {
    bcrypt.hash(userObj.password, 10, function(err, hash) {
      if(err) {
        return cb(err);
      }
      User.create({
        username: userObj.username,
        password: hash
      }, function(err, user) {
        if(err) {
          cb(err);
        } else {
          user.password = null;
          cb(err, user);
        }
    });
  });
};

userSchema.methods.generateToken  = function() {
  //`this` is the document you are calling the method on
  var payload = {
    userId: this._id,
    iat: Date.now() //issued at time
  }
  // generate a token
  var token = jwt.encode(payload, JWT_SECRET);
  return token;
}

// schema.statics -- model method (class method) User.find() User.authenticate()
// schema.methods -- instance model (document method) user.save() user.generateToken()

userSchema.statics.authenticate = function(userObj, cb) {
  User.findOne({username: userObj.username}, function(err, dbuser) {
    if(err || !dbuser) {
      return cb("Authentication failed");
    }
    bcrypt.compare(userObj.password, dbuser.password, function(err, isGood) {
      if(!isGood) {
        return cb("Authentication failed");
      }
      dbuser.password = null;
      cb(null, dbuser);
    });
  });
}

User = mongoose.model('User', userSchema);

module.exports = User;
