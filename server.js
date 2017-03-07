var http = require('http');
var express = require('express');
require('dotenv').config();
var mongojs = require("mongojs");
var db = mongojs(process.env.CONNECTION_STRING,['shortenedurls'] );
//var db = mongojs('');

var router = express();
var server = http.createServer(router);



router.get('/', function(req, res, next){
 //res.type('text/html');
 //res.send('Hello, Anthony');
 db.shortenedurls.find(function(err, urls){
  if(err){
   res.send(err);
  }
  res.json(urls);
  });
});

router.get(/^\/(.+)/, function(req, res, next){
 res.type('text/html');
 
 if(!isNaN(req.params[0])){
  //res.send('URL is shortened. Redirect user.');  
  db.shortenedurls.findOne({shortenedURL: req.params[0]},function(err, url){
   if(err){
     res.send(err);
   }
   if(url === null){
    res.send('URL does not exist. tried to find: ' + req.params[0]);
   }
   else{
    //res.send(url.navURL);
    res.redirect(url.navURL); 
    res.end();
   }
   });
   }
   else{
  //res.send('URL is not shortened. Create shortened URL.'); 
  
  var recordCount;
  
 db.shortenedurls.count(function(err, nbDocs) {
  if(err){
   res.send(err);
  }
  recordCount = nbDocs + 1;
  
  var shortenedURL = {navURL:req.params[0], shortenedURL: recordCount.toString()};
 
 db.shortenedurls.save(shortenedURL, function(err, result){
  if(err){
   res.send(err);
  }
  else{
   res.json(result);
  }
 });
  
  });
  
 }
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
