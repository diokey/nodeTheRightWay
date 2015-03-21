"use strict";
const 
  cluster = require('cluster'),
  fs = require('fs'),
  zmq = require('zmq');

if (cluster.isMaster) {
  //master process - create ROUTER and DEALER sockets, bind endpoints
  let 
    router = zmq.socket('router').bind('tpc://127.0.0.1:5433'),
    dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

  //forward messages between router and dealer
  router.on('message', function () {
    console.log('router received message');
    let frames = Array.prototype.slice.call(arguments); 
    dealer.send(frames);
  });

  dealer.on('message', function () {
    console.log('dealer received message');
    let frames = Array.prototype.slice.call(null, arguments);
    router.send(frames);
  });

  //listen for worker to come online
  cluster.on('online', function(worker) {
    console.log('Worker '+worker.process.pid+' is online');
  });

  //spin up 3 worker process
  for (let i = 0; i<3; i++) {
    cluster.fork();
  }
} else {
  //worker process - Create REP socket, connect to DEALER
  let responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');
 
  responder.on('message', function(data) {
    console.log('message received');
    //parse incoming message
    let request = JSON.parse(data);

    console.log(process.pid + ' recieved request for '+request.path);

    //read file and reply with contents
    fs.readFile(request.path, function(err, data) {
      if (err) {
        throw Error('Unable to read the file' + request.path);
      }
      console.log(process.pid + ' Sending response');
      responder.send(JSON.stringify({
        pid : process.pid,
        data : data.toString(),
        timeStamp : Date.now()
      }));
    });
  });
}
