"use strict";
const 
fs = require('fs'),
net = require('net'),
filename = process.argv[2]
;

const server = net.createServer(function(connection){
  console.log('A subscriber connected');
  var watch = {
    type : 'watching',
    file : filename
  };

  connection.write(JSON.stringify(watch)+" \n");
  
  let watcher = fs.watch(filename, function() {
    var res = {
      type : 'changed',
      file : filename,
      timestamp : Date.now()
    };

    connection.write(JSON.stringify(res)+" \n");
  });

  connection.on('close', function () {
   console.log('A Subscriber disconnected');
   watcher.close();
  });

});

if (!filename) {
  console.log('Target file not found');
}

server.listen(5432, function() {
  console.log('Listening to port 5432');
});
