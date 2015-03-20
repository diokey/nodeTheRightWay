"use strict";

const 
  zmq = require('zmq'),

  //create a subscriber
  subscriber = zmq.socket('sub');

//subscribe to all messages
subscriber.subscribe('');

subscriber.on('message', function (data) {
  let 
    message = JSON.parse(data);
    date = new Date(message.timestamp);

    console.log('File '+message.file+' changed at '+data);
});

subscriber.connect('tpc://localhost:5432');
