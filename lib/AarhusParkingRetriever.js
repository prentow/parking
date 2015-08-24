var config = require('./../config');
var parkingMap = require('./AarhusParkingMap').ParkingMap();
var httpHelper = require('./HttpHelper');

/**
 * Retrieves information on the currently available car park spaces in Aarhus.
 *
 * .retrieveData retrieves information directly from webservice
 * .startRetrieveLoop starts loop which retrieves data from webservice at configured interval
 * .parkingData receives last retrieved data
 * format is documented in /README.md
 */
function ParkingRetriever() {
    var m = {};

    m.parkingData = null;

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
        httpHelper.makeRequest(config.aarhusdata.host, config.aarhusdata.path, null, function(err, result){
            if(!err){
                try{
                    var jsonData = JSON.parse(result);
                    var parkingInfo = parseParkingData(JSON.parse(result));
                } catch (e){
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