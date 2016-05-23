var http = require('http');
http.createServer(function (req, res) {
    console.log('Got request for ' + req.url);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello from Lance & Azure Web Apps!</h1>');
}).listen(process.env.PORT || 8080, function () {
  console.log('Node listening on port 8080!');
});
