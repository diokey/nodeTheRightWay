"use strict"
const 
  fs = require('fs'),
  cheerio = require('cheerio');


module.exports = function (filename, callback) {

  //read the file
  fs.readFile(filename, function(err, data) {
    if (err) {
      return callback(err);
    }

    let 
      $ = cheerio.load(data.toString()),
      collect = function(index, elem) {
        return $(elem).text();
      };
    //null indicates no error occured
    callback(null, {
      _id : $('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''),
      title : $('dcterms\\:title').text(),
      authors : $('pgterms\\:agent pgterms\\:name').map(collect),
      subjects : $('[rdf\\:resource$="/LCSH"] ~ rdf\\:value').map(collect)
    });
  });
};
