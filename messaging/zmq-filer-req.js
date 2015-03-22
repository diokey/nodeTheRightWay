"use strict";

const 
  zmq = require('zmq'),
  filename = process.argv[2],

  //create a request end point
  requester = zmq.socket('req');

  if (!filename) {
    throw Error('Please specify a file');
  }

  //parse incoming response
  requester.on("message", function(data) {
    let response = JSON.parse(data);
    console.log("Received response:", response);
  });
  requester.connect("tcp://localhost:5433");
    // send request for content
  
    for (let i=1; i<=3; i++) {
      console.log('Sending request for ' + filename);
      requester.send(JSON.stringify({
        path: filename
      }));
    }
