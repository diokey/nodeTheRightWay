"use strict";

const 
  fs = require('fs'),
  zmq = require('zmq'),

  //create a publisher endpoint
  publisher = zmq.socket('pub'),
  filename = process.argv[2];

fs.watch(filename, function () {
  publisher.send(JSON.stringfy({
    type : 'changed',
    file : filename,
    timeStamp : Date.now()
  }));  
});

//listen on TCP port 5432
publisher.bind('tpc://*:5432', function(){
  console.log('Listening for zmq subscribers on port 5432');
});
