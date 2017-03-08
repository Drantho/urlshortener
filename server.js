var http = require('http');
var express = require('express');
require('dotenv').config();
var mongojs = require("mongojs");
var db = mongojs(process.env.CONNECTION_STRING, ['shortenedurls']);

var router = express();
var server = http.createServer(router);
router.get('/', function (req, res, next) {
    //res.type('text/html');
    //res.send('Hello, Anthony');
    db.shortenedurls.find(function (err, urls) {
        if (err) {
            res.send(err);
        }
        res.send('<h1>URL Shortener</h1><h3>Add Shortened URL</h3>Add /&lt;url&gt; to the address.<h3>Go to shortened URL</h3>Add /&lt;number&gt; to address.<br><br><h3>Current Shortened URLs</h3>' + JSON.stringify(urls));
    });
});

router.get(/^\/(.+)/, function (req, res, next) {
 
 if (req.params[0] != 'favicon.ico') {
  res.type('text/html');
  
  if (!isNaN(req.params[0])) {
   
   //URL is shortened. Redirect user.  
   
   db.shortenedurls.findOne({ shortenedURL: req.params[0] }, function (err, url) {
    if (err) {
     res.send(err);
     }
     if (url === null) {
      res.send('URL does not exist. tried to find: ' + req.params[0]);
     }
     else {
      res.redirect(url.navURL);
      res.end();
     }
   });
  }
  else {
   
   //URL is not shortened. Create shortened URL 
   
   var recordCount;
   db.shortenedurls.count(function (err, nbDocs) {
    if (err) {
     res.send(err);
    }
    recordCount = nbDocs + 1;
    
    var shortenedURL = { navURL: req.params[0], shortenedURL: recordCount.toString() };
    
    db.shortenedurls.save(shortenedURL, function (err, result) {
     if (err) {
      res.send(err);
     }
     else {
      res.json(result);
     }
    });
   });
  }
 }
 else {
  res.redirect('/');
 }
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
 var addr = server.address();
 console.log("Server listening at", addr.address + ":" + addr.port);
});