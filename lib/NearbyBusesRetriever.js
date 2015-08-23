var http = require('http');
var config = require('./../config');
var parseString = require('xml2js').parseString;

function RetrieveBuses(lat, lng, callback) {

    console.log("lat .. " + lat + "   " + lng );
   var options = {
        host: config.busesretriever.host,
        path: config.busesretriever.path.stopsnearby + '?coordX=' + (Math.floor(parseFloat(lng)*1000000)) + '&coordY=' + (Math.floor(parseFloat(lat)*1000000)) + '&maxRadius=250&maxNumber=5'
    };
    var req = http.get(options, function(res) {
        //TODO: CHeck res.statusCode == 200
        var bodyChunks = [];
        console.log(options.path);
        res.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            parseString(body, function (err, result) {
                var locations = result.LocationList.StopLocation;
                var resList = [];
                var idList  = [];
                for(var i in locations){
                    var test = {name : locations[i].$.name};
                    resList.push(test);
                    console.log("hejhej" + test);
                    idList.push(locations[i].$.id);
                }
                retrieveConnections(idList, function(result){
                    callback(result);
                });

            });
        })
    });
    req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });
}

function retrieveConnections(ids, callback){
    var date = new Date();
    var idString ="";
    for(var i in ids){
        if(i!= 0)
            idString += "&";
        idString += "id" + (parseInt(i)+1) + "=" + ids[i];
    }
    var options = {
        host: config.busesretriever.host,
        path: config.busesretriever.path.departureboard + '?' + idString + "&date=" + date.getDate() + "." + (date.getMonth()+1) + "." + (date.getFullYear()%100) +
            "&time=" + date.getHours() + ":" + date.getMinutes()
    };
    console.log(options.path);
    var req = http.get(options, function(res) {
        //TODO: CHeck res.statusCode == 200
        var bodyChunks = [];
        console.log(options.path);
        res.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            parseString(body, function (err, result) {
                console.dir(result);
                var departures = result.MultiDepartureBoard.Departure;
                var resList = new Object();
                resList.stopnames = [];
                resList.stops = new Object();
                for(var i in departures){
                    if(i>=10)
                        break;
                    console.log(departures[i].$.stop);
                    var stopName = departures[i].$.stop;
                    if(resList.stops[stopName] == null) {
                        resList.stops[stopName] = [];
                        resList.stopnames.push(stopName);
                    }
                    resList.stops[stopName].push({
                        name : departures[i].$.name,
                        stop : departures[i].$.stop,
                        time : departures[i].$.time,
                        direction : departures[i].$.direction});
                }
                console.log(resList);
                callback(resList);
            });
        })
    });
    req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });
}

module.exports.RetrieveBuses = RetrieveBuses;