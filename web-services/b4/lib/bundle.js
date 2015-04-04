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

  app.get('/api/bundle/:id', function(req, res){
    let params = {
      method : 'GET',
      url : config.b4db + '/' + req.params.id,
      auth : config.credentials,
    };

    Q.nfcall(request, params)
    .then(function (args) {
      let couchRes = args[0],
        body = JSON.parse(args[1]);
      res.status(couchRes.statusCode).json(body);
    }, function (err) {
      res.status(502).json({error : 'bad_gateway', reason : err.code});
    }).done();
  });

  app.put('/api/bundle/:id/name/:name', function (req, res) {
    let params = {
      method : 'GET',
      url : config.b4db + '/' + req.params.id,
      auth : config.credentials,
    };

    Q.nfcall(request, params)
    .then(function (args) {
      let couchRes = args[0],
      bundle = args[1];

      if (couchRes.statusCode !== 200) {
        return [couchRes, bundle];
      }

      bundle.name = req.params.name;

      params.method = 'PUT';
      params.json = bundle;
      return Q.nfcall(request, params) 
      .then(function (args) {
        let couchRes = args[0],
          body = args[1];
      })
      .catch(function(err) {
        res.json(502, {error : "bad_gateway", reason : err.code});
      })
      .done();
    });
    
  });
};
