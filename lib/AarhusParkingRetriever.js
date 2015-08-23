var config = require('./../config');
var parkingMap = require('./AarhusParkingMap').ParkingMap();
var httpHelper = require('./HttpHelper');

function ParkingRetriever() {
    var m = {};

    m.parkingData = new Object();

    m.startRetrieveLoop = function () {
        m.retrieveData(function (err, result) {
            if(!err)
                m.parkingData = result;
        })
        setTimeout(function () {
            m.startRetrieveLoop();
        }, config.parkingretriever.retrieveinterval);
    };

    m.retrieveData = function (callback){
        httpHelper.makeRequest(config.aarhusdata.host, config.aarhusdata.path, function(err, result){
            if(!err){
                try{
                    var jsonData = JSON.parse(result);
                    var parkingInfo = parseParkingData(JSON.parse(result));
                } catch (e){
                    console.log('Could not parse retrieved JSON');
                    callback(e);
                    return;
                }
                callback(null, parkingInfo);
            } else{
                callback(err);
            }
        });
    };

    return m;
}

function parseParkingData(jsonRecords){
    var parkingInfos = [];
    var records = jsonRecords.result.records;
    for (var i in records) {
        var curRecord = records[i];
        if (parkingMap[curRecord.garageCode] != null) {
            parkingInfos.push({
                name: parkingMap[curRecord.garageCode].prettyName,
                coords: {
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