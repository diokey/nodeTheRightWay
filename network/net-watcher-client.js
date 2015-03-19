"use strict"

const 
net = require('net'),
client = net.connect({port : 5432}),
ldj = require('./ldj.js'),
ldjClient = ldj.connect(client)
;

ldjClient.on('message', function(message) {

  if(message.type ==='watching') {
    console.log('Now watching file ' + message.file);
  } else if (message.type === 'changed') {
    let time = new Date(message.timestamp);
    console.log('File '+message.file+ ' changed at '+time);
  } else {
    throw Error('Unrecognized message type');
  }
});
