var http = require('http');
var config = require('./config');
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
                for(var i in locations){
                    var test = {name : locations[i].$.name};
                    resList.push(test);
                }
                callback(resList);
            });
        })
    });
    req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });
}
module.exports.RetrieveBuses = RetrieveBuses;