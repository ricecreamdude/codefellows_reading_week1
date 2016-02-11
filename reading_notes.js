//Building the Application Stack

var http = require('http');

//Basic way to create a new server - Not Async
http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8000);

//Passing functions around
  //Introduction to Currying

function say (word) {
    console.log(word);
}

function execute(someFunction , value) {
  someFunction(value);
}

//What does this become?
execute(say, "Hello"); //say("Hello")

//Currying can be used to achieve this result
//Asychronous callback for server creation
var http = require("http");

//Allows anything past 'http' to run BEFORE onRequest is completed
function onRequest(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
  console.log("This will run second")
}

http.createServer(onRequest).listen(8888);
console.log("This will run first"); //I think this will run first


//What is needed to 'route' requests?
//Used to feed URL requests into our router.  Uses the URL module.
//Server.js
var http = require('http');
var url = require('url');

function start(){
  function onRequest(res , req) {
    var pathName = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    route(pathname);    //Utilized in route.js

    res.writeHead( 200 , {"Content-Type":"text/plain"} );
    res.write('Hello World!');
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started");

}

module.exports = exports.start = start;

//route.js, This is the router for the above Server

function route ( path ) {
  console.log("Routing a request for " + path);
}

module.exports = exports.route = route;

//index.js, which pulls in router and server together
var server = require( __dirname + "/server");
var route = require( __dirname + "/route");

server.start(router.route);


//Execution in the Kingdom of Verbs
// Remember that we are working with VERB objects in the technology sphere.
// This is important for coding as a philosophy - it allows you to create
// verb oriented code for readability.

//////////////////////////////////////
//Routing to real requestt handdlers//
//////////////////////////////////////


//requestHandlers.js
function start() {
  console.log("Request handler 'start' was called.");
}

function upload() {
  console.log("Request handler 'upload' was called.");
}

exports.start = start;
exports.upload = upload;

//index.js - Adding the request handlers with dependency injection.
var server = require( __dirname + "/server");
var route = require( __dirname + "/route");
var requestHandlers = require( __dirname + "/requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);

//server.js - Rewritten to handle 'handle'
var http = require('http');
var url = require('url');

function start(route , handle){
  function onRequest(res , req) {
    var pathName = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    route(handle, pathname);    //Utilized in route.js

    res.writeHead( 200 , {"Content-Type":"text/plain"} );
    res.write('Hello World!');
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started");

}

module.exports = exports.start = start;

//route.js - Rewritten to handle 'route'
function route ( handle, path ) {
  console.log("Routing a request for " + path);

  if (typeof handle[pathname] === 'function'){
    handle[pathname]();
  }
  console.log("No request handler found for " + pathname);
}
module.exports = exports.route = route;

////////////////////////////////////////
//Making the Request Handlers Respond //
////////////////////////////////////////

//Blocking vs Non-Blocking
//Blocking functions will occupy the event loop and prevent other processes
//from running. Using the module 'child_process' helps you avoid this.

//eventHandler.js
var exec = require("child_process").exec;

function start() {
  console.log("Request handler 'start' was called.");
  var content = "empty";

  exec('ls -lah' , function (err , stdout , stderr) {
    content = stdout;
  });

  return content;

}

function upload() {
  console.log("Request handler 'upload' was called.");
  return "Hello Upload";
}

exports.start = start;
exports.upload = upload;

//exec() executes shell commands from within Node.js and avoids the
//event loop.

//Handling POST requests
//server.js

var http = require('http');
var url = require('url');

function start(route , handle){
  function onRequest(res , req) {
    var postData = "";
    var pathName = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    req.setEncoding('utf8');

    req.addListener('data' , function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk ' " + postDataChunk + " '.");
    });

    req.addListener('end' , () => {
      route(handle , pathname , res , postData);
    });
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started");

}

module.exports = exports.start = start;

//router.js
function route ( handle, path , res , postData ) {      //Changes
  console.log("Routing a request for " + path);
  if (typeof handle[pathname] === 'function'){
    handle[pathname](res, postData);                    //Changes
  } else {
    console.log("No request handler found for " + pathname);
    res.writeHead(404 , {"Content-Type": "text/plain"});
    res.write("404 - Not Found.");
    res.end();
  }
}
module.exports = exports.route = route;

/////////////////////////////////////////
//        Handling File Uploads        //
/////////////////////////////////////////

//Cool module - node-formidable - Removes weird parsing stuff from
//loading files.
