"use strict";

const 
  express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  app = express(),
  redisClient = require('redis').createClient(),
  RedisStore = require('connect-redis')(session),
  passport = require('passport'),
  GoogleStrategy = require('passport-google').Strategy,
  log = require('npmlog'),
  request = require('request'),
  config = {
    bookdb : 'http://localhost:5984/books/',
    b4db : 'http://localhost:5984/b4/',
    credentials : {
        user : 'admin',
        pass : 'diokey'
    }
  },

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

app.get('/api/user', authed, function (req, res) {
  res.json(req.user);
});

app.get('/api/user/bundles', [authed, bodyParser.json()], function (req, res) {
  let userURL = config.b4db + encodeURIComponent(req.user.identifier);
  request(userURL, function (err, couchRes, body) {
    if (err) {
      res.status(502).json({error : 'bad_gateway', reason : err.code});
    } else if (couchRes.statusCode === 200) {
      let user = JSON.parse(body);
      user.bundles = req.body;
      request.put({url : userURL, json : user}).pipe(res);
    } else if (couchRes.statusCode === 404) {
      let user = {bundles : req.body};
      request.put({url : userURL, json : user}).pipe(res);
    } else {
      res.status(couchRes.statusCode).send(body);
    }
  });
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


