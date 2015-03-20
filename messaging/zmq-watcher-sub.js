"use strict";

const 
  zmq = require('zmq'),

  //create a subscriber
  subscriber = zmq.socket('sub');

//subscribe to all messages
subscriber.subscribe('');

subscriber.on('message', function (data) {
  let 
    message = JSON.parse(data),
    date = new Date(message.timeStamp);

    console.log('File '+message.file+' changed at '+date);
});

subscriber.connect('tcp://localhost:5432');
