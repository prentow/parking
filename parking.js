var express = require('express');
var http = require('http');
var config = require('./config');
var retriever = require('./AarhusParkingRetriever').ParkingRetriever();
var busesRetriever = require('./NearbyBusesRetriever').RetrieveBuses;
var app = express();

app.use(express.static(__dirname + '/web'));

app.set('port', config.web.port);

app.get('/parking', function(request, response) {
    response.send(200, JSON.stringify(retriever.parkingData));
});

app.get('/stops', function(request, response) {
    var lat = request.query.lat;
    var lng = request.query.lng;
    console.log("lat" + lat);
    console.log(request.query);
    busesRetriever(lat, lng, function(businfo) {
        console.log("WAAAH" + businfo + "Waah");
        response.send(200, JSON.stringify(businfo));
    });
});

retriever.startRetrieveLoop();

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});

//busesRetriever(56.15396301219192, 10.21350598245308);

