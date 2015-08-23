var http = require('http');
var config = require('./../config');
var parseXml = require('xml2js').parseString;
var httpHelper = require('./HttpHelper');

function RetrieveStops(lat, lng, callback) {
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
                callback(null, idList);
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

module.exports.RetrieveStops = RetrieveStops;