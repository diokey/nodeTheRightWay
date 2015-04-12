"use strict";

const 
  express = require('express'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  app = express(),
  redisClient = require('redis').createClient(),
  RedisStore = require('connect-redis')(session),
  passport = require('passport'),
  GoogleStrategy = require('passport-google').Strategy,
  log = require('npmlog'),

  authed = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else if (redisClient.ready) {
      res.status(403).json({
        error : 'forbidden',
        reason : 'not_authenticated'
      }); 
    } else {
      res.status(503).json({
        error : 'service_unavailable',
        reason : 'authentication_unavailable'
      });
    }
  }
  ;

  app.use(cookieParser());
  app.use(session({
    secret : 'mysecredhash',
    resave : false,
    saveUninitialized : true,
    store : new RedisStore({
      client : redisClient
    })
  }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.identifier);
});

passport.deserializeUser(function(id, done) {
  done(null, {identifier : id});
});

passport.use(new GoogleStrategy({
  returnURL : 'http://localhost:3000/auth/google/return',
  realm : 'http://localhost:3000/'
},
function (identifier, profile, done) {
  profile.identifier = identifier;
  return done(null, profile);
}));


app.get('/auth/google/:return?', passport.authenticate('google', {successRedirect : '/'}));
app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

redisClient
  .on('ready', function () {
    log.info('REDIS', 'ready');
  })
  .on('error', function (err) {
    log.error('REDIS', err.message);
  });

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname +'/bower_components'));

app.listen(3000, function () {
  console.log('express server listening to port 3000');
});


