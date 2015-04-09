"use strict";

const 
  express = require('express'),
  app = express(),
  redis = require('redis'),
  redisConnect = require('redis-connect');

app.use(express.cookieParser());
app.use(express.session({
  secret : 'mysecredhash',
  store : new redisConnect({
    client : redis
  })
}));

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname +'/bower_components'));

app.listen(3000, function () {
  console.log('express server listening to port 3000');
});


