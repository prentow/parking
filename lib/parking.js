var express = require('express');
var http = require('http');
var config = require('./../config');
var retriever = require('./AarhusParkingRetriever').ParkingRetriever();
var stopsRetriever = require('./NearbyStopsRetriever').RetrieveStops;
var connectionsRetriever = require('./StopConnectionsRetriever').RetrieveConnections;
var distanceRetriever = require('./DistanceRetriever').RetrieveDistances;
var app = express();
var log4js = require( "log4js" );

function createApplication() {

    //Configure logging
    log4js.configure( "./log4js.config" );
    var logger = log4js.getLogger( "fileLogger" );

    //Hosting of static assets
    app.use(express.static(__dirname + './../public'));
    app.set('port', config.web.port);

    //Setup /parking webservice endpoint
    app.get('/parking', nocache, function (request, response) {
        logger.info("Incoming request for parking availability");
        if(retriever.parkingData == null){
            response.send(500, "Could not retrieve parking data!");
            logger.error("Could not retrieve parking data!");
        } else {
            response.send(200, JSON.stringify(retriever.parkingData));
        }
    });

    //Setup /stops webservices endpoint
    app.get('/stops', nocache, function (request, response) {
        logger.info("Incoming request for connecting stops");
        var lat = request.query.lat;
        var lng = request.query.lng;
        stopsRetriever(lat, lng, function (err, idList) {
            if(err) {
                response.send(500, "Error while performing request");
                logger.error(err);
            } else {
                if(idList.length == 0){
                    response.send(404, "No stops close to location!");
                    return;
                }
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

    //Setup /distances webservices endpoint
    app.get('/distances', nocache, function (request, response) {
        logger.info("Incoming request for distances to stops");
        var lat = request.query.lat;
        var lng = request.query.lng;
        if(retriever.parkingData == null){
            response.send(500, "Could not retrieve parking data!");
            logger.error("Could not retrieve parking data!");
        } else {
            var parkings = retriever.parkingData;
            var locations = [];
            for(var i in parkings){
                locations.push(parkings[i].coords);
            }
            distanceRetriever({lat : lat, lng : lng}, locations, function (err, result){
                if(err) {
                    response.send(500, "Could not compute distances!");
                    logger.error("Could not compute distances!");
                } else {
                    var durations = [];
                    for(var i in parkings){
                        if(result[i] != null) {
                            result[i].name = parkings[i].name;
                            durations.push(result[i]);
                        }
                    }
                    durations.sort(function(a,b){return a.duration - b.duration});
                    response.send(200, JSON.stringify(durations));
                }
            })
        }
    });

    //Start retrieving of parking availability information
    retriever.startRetrieveLoop();

    http.createServer(app).listen(app.get('port'), function () {
        logger.info('Server listening on port ' + app.get('port'));
    });

    return app;
}

//Avoid caching of webservice results
function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

module.exports.createApplication = createApplication;

