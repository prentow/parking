var express = require('express');
var http = require('http');
var config = require('./../config');
var retriever = require('./AarhusParkingRetriever').ParkingRetriever();
var stopsRetriever = require('./NearbyStopsRetriever').RetrieveStops;
var connectionsRetriever = require('./StopConnectionsRetriever').RetrieveConnections;
var app = express();

function createApplication() {

    app.use(express.static(__dirname + './../web'));

    app.set('port', config.web.port);

    app.get('/parking', function (request, response) {
        console.log("Incoming request for parking availability");
        if(retriever.parkingData == null){
            response.send(500, "Could not retrieve parking data!");
            console.log("Could not retrieve parking data!");
        } else {
            response.send(200, JSON.stringify(retriever.parkingData));
        }
    });

    app.get('/stops', function (request, response) {
        console.log("Incoming request for connecting stops");
        var lat = request.query.lat;
        var lng = request.query.lng;
        stopsRetriever(lat, lng, function (err, idList) {
            if(err) {
                response.send(500, "Error while performing request");
                console.log(err);
            } else {
                connectionsRetriever(idList, function(err, connectionsInfo){
                    if(err){
                        response.send(500, "Error while performing request");
                        console.log(err);
                    } else {
                        response.send(200, JSON.stringify(connectionsInfo));
                    }
                });
            }
        });
    });

    retriever.startRetrieveLoop();

    http.createServer(app).listen(app.get('port'), function () {
        console.log('Server listening on port ' + app.get('port'));
    });

    return app;
}

module.exports.createApplication = createApplication;

