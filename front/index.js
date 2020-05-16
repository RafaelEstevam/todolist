var fs = require("fs");
var host = "localhost";
var port = 8080;
var express = require("express");

var app = express();
app.use(express.static(__dirname + "/public")); //use static files in ROOT/public folder

app.get("/", function(request, response){ //root dir
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, host);