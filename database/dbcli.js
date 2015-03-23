#!/usr/bin/env node --harmony

const 
  request = require('request'),
  options = {
    method : process.argv[2],
    auth : {
    user : 'diokey',
    pass : 'diokey',
    sendImmediately : false
    },
    url : 'http://localhost:5984/' + (process.argv[3] || '')
  };

request(options, function (err, res, body) {
  if (err) {
    throw Error(err);
  } else {
    var response = JSON.parse(body);
    console.log(res.statusCode, response);
  }
});
