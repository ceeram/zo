var osc = require('node-osc'),
    io = require('socket.io').listen(8081);

var oscServer = new osc.Server(3333, "127.0.0.1");
var oscClient = new osc.Client("127.0.0.1", 3334);

io.sockets.on('connection', function (socket) {
  oscServer.on('message', function(msg, rinfo) {
    socket.emit("message", msg.join(' '));
  });
  socket.on("message", function () {
    oscClient.send.apply(oscClient, arguments);
  });
});

var http = require('http'),
    path = require('path'),
    fs = require('fs');

function getFile(filePath,res){
  fs.readFile(filePath,function(err,contents){
    res.end(contents);
  });
};

function requestHandler(req, res) {
  var fileName = path.basename(req.url) || 'index.html',
      localFolder = __dirname + '/public/';

  if (fileName == 'socket.io.js') {
    http.get("http://127.0.0.1:8081/socket.io/socket.io.js", function(resp) {
      var body = '';
      resp.on('data', function(chunk) {
        body += chunk;
      });
      resp.on('end', function() {
        res.end(body);
      });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  } else {
    getFile((localFolder + fileName), res);
  }
};

http.createServer(requestHandler).listen(3000);