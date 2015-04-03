#!/usr/bin/env node
"use strict";

const 
  express = require('express'),
  morgan = require('morgan'),
  app = express(),
  config = {
    bookdb : 'http://localhost:5984/books/',
    b4db : 'http://localhost:5984/b4/',
    credentials : {
        user : 'admin',
        pass : 'diokey'
    }
  };

app.use(morgan('combined'));

//require('./lib/book-search.js')(config, app);
require('./lib/field-search.js')(config, app);
require('./lib/bundle.js')(config, app);

app.listen(3000, function () {
  console.log('listening to port 3000');
});
