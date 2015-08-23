var express = require('express');
var http = require('http');
var config = require('./../config');
var retriever = require('./AarhusParkingRetriever').ParkingRetriever();
var stopsRetriever = require('./NearbyStopsRetriever').RetrieveStops;
var connectionsRetriever = require('./StopConnectionsRetriever').RetrieveConnections;
var app = express();
var log4js = require( "log4js" );

function createApplication() {
    log4js.configure( "./log4js.config" );
    var logger = log4js.getLogger( "fileLogger" );

    app.use(express.static(__dirname + './../public'));

    app.set('port', config.web.port);

    app.get('/parking', function (request, response) {
        logger.info("Incoming request for parking availability");
        if(retriever.parkingData == null){
            response.send(500, "Could not retrieve parking data!");
            logger.error("Could not retrieve parking data!");
        } else {
            response.send(200, JSON.stringify(retriever.parkingData));
        }
    });

    app.get('/stops', function (request, response) {
        logger.info("Incoming request for connecting stops");
        var lat = request.query.lat;
        var lng = request.query.lng;
        stopsRetriever(lat, lng, function (err, idList) {
            if(err) {
                response.send(500, "Error while performing request");
                logger.error(err);
            } else {
                connectionsRetriever(idList, function(err, connectionsInfo){
                    if(err){
                        response.send(500, "Error while performing request");
                        logger.error(err);
                    } else {
                        response.send(200, JSON.stringify(connectionsInfo));
                    }
                });
            }
        });
    });

    retriever.startRetrieveLoop();

    http.createServer(app).listen(app.get('port'), function () {
        logger.info('Server listening on port ' + app.get('port'));
    });

    return app;
}

module.exports.createApplication = createApplication;

