"use strict"
const 
net = require('net'),


server = net.createServer(function(connection) {
  console.log('Subscriber connected');

  //send first chunk imediately
  connection.write(
    '{"type":"changed","file":"targ'
  );

  //send the other chunk after a second
  let timer = setTimeout(function(){
    connection.write('et.txt","timestamp":1358175758495}' + "\n");
    connection.end();
  }, 1000);

  connection.on('end', function (argument) {
    clearTimeout(timer);
    console.log('Subscriber disconnected');
  });
  
});

server.listen(5432, function () {
  console.log('test server running');
});
