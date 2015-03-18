"use strict";
const 
fs = require('fs'),
net = require('net'),
filename = process.argv[2],
server = net.createServer(function(connection) {

  connection.write('Watching file '+filename);

  console.log('Subscriber connected');
  
  let watcher = fs.watch(filename, function(){
    connection.write('File '+filename+' changed : '+Date.now() +"\n");
  });

  //clean up
  connection.on('close', function(){
    console.log('Subscriber disconnected');
    watcher.close();
  });
});

if (!filename) {
  throw Error('file not found');
}

server.listen(5432, function() {
  console.log('Listen to port 5432');
});
