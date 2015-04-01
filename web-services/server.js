'use strict';

const 
  http = require('http'),
  server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('hello world');
  });

  server.listen(3000, function() {
    console.log('listening to port 3000');
  });
