"use strict"
const 
util = require('util'),
events = require('events');

const LDJClient = function(stream) {
  events.EventEmitter.call(this);

  let self = this,
  buffer = '';

  stream.on('data', function(data) {
    buffer += data;

    let boundary = buffer.indexOf('\n');

    while(boundary !== -1) {
      //get the string till to the end on message. "(end of line \n)"
      let input = buffer.substr(0, boundary);
      //the string after \n is the new message
      buffer = buffer.substr(boundary + 1);
      //update the boundary
      boundary = buffer.indexOf('\n');

      self.emit('message', JSON.parse(input));
    }
  });
};

util.inherits(LDJClient, events.EventEmitter);

//expose the module
exports.LDJClient = LDJClient;
exports.connect = function (stream) {
  return new LDJClient(stream);
};
