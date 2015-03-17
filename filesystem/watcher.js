"use strict";
const 
  fs = require('fs'),
  spawn = require('child_process').spawn,
  filename = process.argv[2];

  if (!filename) {
    throw Error('No file name were provided');
  }

//watch for file changes
fs.watch(filename, function() {
  //use ls to get file information
  let ls = spawn('ls',['-lh', filename]);
  ls.stdout.pipe(process.stdout);
});
console.log('Now watching file '+filename);
