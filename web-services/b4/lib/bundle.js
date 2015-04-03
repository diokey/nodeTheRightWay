"use strict";

const 
  Q = require('q'),
  request = require('request');

module.exports = function(config, app) {
  app.post('/api/bundle', function (req, res) {
    let deferred = Q.defer();

    request({
      method : 'POST',
      url : config.b4db,
      auth : config.credentials,
      json : {type : 'bundle', name : req.query.name, books: {} }
    }, function (err, couchRes, body) {
      if (err) {
        deferred.reject(err);
      } else {
        console.log('success');
        deferred.resolve([couchRes, body]);
      }
    });

    deferred.promise.then(function (args) {
      let couchRes = args[0], body = args[1];
      res.json(couchRes.statusCode, body); 
    }, function (err) {
      res.status(502).json({error : 'bad_gateway', reason : err.code});
    });

  });
};
