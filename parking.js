var express = require('express');
var http = require('http');
var config = require('./config');
var retriever = require('./AarhusParkingRetriever').ParkingRetriever();
var app = express();

app.use(express.static(__dirname + '/web'));

app.set('port', config.web.port);

app.get('/parking', function(request, response) {
    response.send(200, JSON.stringify(retriever.parkingData));
});

retriever.startRetrieveLoop();

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});

