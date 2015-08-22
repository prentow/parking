var http = require('http');
var config = require('./config');
var parkingMap = require('./AarhusParkingMap').ParkingMap();

function ParkingRetriever() {
    var m = {};
    m.parkingData = new Object();
    m.startRetrieveLoop = function () {
        var options = {
            host: config.aarhusdata.host,
            path: config.aarhusdata.path
        };
        var req = http.get(options, function(res) {
            //TODO: CHeck res.statusCode == 200
            var bodyChunks = [];
            res.on('data', function(chunk) {
                bodyChunks.push(chunk);
            }).on('end', function() {
                var body = Buffer.concat(bodyChunks);
                m.parkingData = parseParkingData(JSON.parse(body));
            })
        });
        req.on('error', function(e) {
            console.log('ERROR: ' + e.message);
        });
        setTimeout(function () {
            m.startRetrieveLoop();
        }, config.parkingretriever.retrieveinterval);
    };
    return m;
}

function parseParkingData(jsonRecords){
    var records = jsonRecords.result.records;
    var parkingInfos = [];
    for(var pinfo in records){
        var curRecord = records[pinfo];
        if(parkingMap[curRecord.garageCode] != null){
            parkingInfos.push({
                name : curRecord.garageCode,
                coords : {
                    lat: parkingMap[curRecord.garageCode].lat,
                    lng: parkingMap[curRecord.garageCode].lng
                },
                capacity: curRecord.totalSpaces,
                count: curRecord.vehicleCount
            });
        }
    }
    return parkingInfos;
}

module.exports.ParkingRetriever = ParkingRetriever;