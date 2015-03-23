#!/usr/bin/env iojs

"use strict"

const 
  request = require('request'),
  options = {
    method : process.argv[2],
    auth : {
    user : 'admin',
    pass : 'diokey',
    sendImmediately : false
    },
    url : 'http://localhost:5984/' + (process.argv[3] || '')
  };

request(options, function (err, res, body) {
  if (err) {
    throw Error(err);
  } else {
    let response = JSON.parse(body);
    console.log(res.statusCode, response);
  }
});
