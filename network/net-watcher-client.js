"use strict"

const 
net = require('net'),
client = net.connect({port : 5432});

client.on('data', function(data) {
  let message = JSON.parse(data);

  if(message.type ==='watching') {
    console.log('Now watching file ' + message.file);
  } else if (message.type === 'changed') {
    let time = new Date(message.timestamp);
    console.log('File '+message.file+ ' changed at '+time);
  }
});
