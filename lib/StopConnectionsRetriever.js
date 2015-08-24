var http = require('http');
var config = require('./../config');
var parseXml = require('xml2js').parseString;
var httpHelper = require('./HttpHelper');
var moment = require('moment-timezone');

/**
 * Retrieves departures at a number of stops
 *
 * @param ids List of stop ids for which to retrieve departures
 * @param callback function (err, result), called with (null, result) or (error) if an error occurs.  Format is documented in /README.md
 */
function RetrieveConnections(ids, callback){
    var now = new Date();
    var nowTz = moment.tz(now,config.busesretriever.bustimezone);
    var params = {
        date : nowTz.date() + "." + (nowTz.month()+1) + "." + (nowTz.year()%100),
        time : nowTz.hours() + ":" + nowTz.minutes()
    }
    for(var i in ids){
        params['id' + (parseInt(i)+1)] = ids[i];
    }
    httpHelper.makeRequest(config.busesretriever.host, config.busesretriever.path.departureboard,params, function(err,body) {
        if(err){
            callback(err);
            return;
        }
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