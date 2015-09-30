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
    getFile(localFolder + fileName, res);
  }
};

http.createServer(requestHandler).listen(3000);

'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();
var address;

Object.keys(ifaces).forEach(function (ifname) {

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        if (ifname == 'wlan0') {
            console.log('webserver started at: ' + iface.address + ':3000');
            address = iface.address + ':3000/qr.html';
        }
    });
});

var exec = require('child_process').exec;
exec('firefox ' + address, function (error, stdout, stderr) {
    //output is in stdout
});
exec('pd pd/start.pd', function (error, stdout, stderr) {
    //output is in stdout
});