#!/usr/bin/env node

"use strict"

const 
  async = require('async'),
  request = require('request'),
  views = require('./lib/views.js'),
  credentials = {
      user : 'admin',
      pass : 'diokey',
    };

async.waterfall([
  //get the existing design document
  function (next) { 
    request({
      method : 'GET',
      url : 'http://localhost:5984/books/_design/books',
      auth : credentials
    }, next);
  },

  //create a new design doc or use existing
  function (res, body, next) {
    console.log('next');
    if (res.statusCode === 200) {
      next(null, JSON.parse(body));
    } else if (res.statusCode === 404) {
      next(null, {views : {} });
    }
  },

  //add view to document and submit
  function (doc, next) {
    Object.keys(views).forEach(function(name) {
      doc.views[name] = views[name];
    });

    request({
      method : 'PUT',
      url : 'http://localhost:5984/books/_design/books',
      auth : credentials,
      json : doc
    }, next);
  }
], function (err, res, body) {
  if (err) {
    throw err;
  } else {
    console.log(res.statusCode, body);
  }
});

