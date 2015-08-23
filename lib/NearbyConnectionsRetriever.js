var http = require('http');
var config = require('./../config');
var parseXml = require('xml2js').parseString;
var httpHelper = require('./HttpHelper');

function RetrieveConnections(lat, lng, callback) {
    var params = {
        coordX : (Math.floor(parseFloat(lng)*1000000)),
        coordY : (Math.floor(parseFloat(lat)*1000000)),
        maxRadius : 250,
        maxNumber : 5
    };
    httpHelper.makeRequest(config.busesretriever.host, config.busesretriever.path.stopsnearby, params, function(err,body) {
        if(err){
            callback(err);
            return;
        }
        parseXml(body, function (err_, result) {
            if(err_) {
                callback(err_);
                return;
            }
            var idList = parseIds(result);
            if(idList != null) {
                retrieveConnections(idList, callback);
            } else {
                callback(new Error("Could not parse ids"));
            }
        });
    });
}

function parseIds(xmlBody){
    try {
        var locations = xmlBody.LocationList.StopLocation;
        var idList = [];
        for (var i in locations) {
            idList.push(locations[i].$.id);
        }
        return idList;
    } catch (e){
        return null;
    }
}

function retrieveConnections(ids, callback){
    var now = new Date();
    var params = {
        date : now.getDate() + "." + (now.getMonth()+1) + "." + (now.getFullYear()%100),
        time : now.getHours() + ":" + now.getMinutes()
    }
    for(var i in ids){
        params['id' + (parseInt(i)+1)] = ids[i];
    }
    httpHelper.makeRequest(config.busesretriever.host, config.busesretriever.path.departureboard,params, function(err,body) {
        parseXml(body, function (err, result) {
            if(err){
                callback(err);
                return;
            }
            var resList = parseStopInfo(result);
            if(resList != null)
                callback(null, resList);
            else
                callback(new Error("Could not parse stop information"));
        });
    });
}

function parseStopInfo(xmlBody){
    try {
        var departures = xmlBody.MultiDepartureBoard.Departure;
        var resList = new Object();
        resList.stopnames = [];
        resList.stops = new Object();
        for (var i in departures) {
            if (i >= config.busesretriever.maxconnections)
                break;
            var stopName = departures[i].$.stop;
            if (resList.stops[stopName] == null) {
                resList.stops[stopName] = [];
                resList.stopnames.push(stopName);
            }
            resList.stops[stopName].push({
                name: departures[i].$.name,
                stop: departures[i].$.stop,
                time: departures[i].$.time,
                direction: departures[i].$.direction
            });
        }
        return resList;
    } catch (e){
        return null;
    }
}

module.exports.RetrieveConnections = RetrieveConnections;