var assert = require("chai").assert;
var mockery = require('mockery');
var fs = require('fs');
require('array.prototype.find');

var helperStuba = {
    makeRequest : function(host, path,params, callback){
        var file;
        if(path.indexOf('stopsNearby') != -1)
            file =  __dirname + '/data/stopLocationsResponse.txt';
        else
            file =  __dirname + '/data/nearbyConnectionsResponse.txt';
        fs.readFile(file, function (err, data) {
            if (err) {
                throw err;
            }
            callback(null, data);
        });
    }
}

describe('NearbyConnectionsRetriever', function() {
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
    });

    beforeEach(function() {
        mockery.registerMock('./HttpHelper', helperStub);
        retriever = require("./../lib/NearbyConnectionsRetriever");
    });

    afterEach(function(){
        mockery.deregisterAll();
    });

    after(function(){
        mockery.disable();
    });

    describe('#RetrieveConnections()', function () {
        it('Should parse responses correctly', function (done) {
            var lat = '56.23423423';
            var lng = '10.32423423';
            retriever.RetrieveConnections(lat, lng, function(err, data){
                assert.equal(data.stopnames.length, 3);
                assert.notEqual(data.stopnames.indexOf('Busgaden (Aarhus)'), -1);
                assert.equal(data.stops['Busgaden (Aarhus)'].length, 5);
                assert.equal(data.stops['Busgaden (Aarhus)'][0].name,'Bybus 2A');
                assert.equal(data.stops['Busgaden (Aarhus)'][0].stop,'Busgaden (Aarhus)');
                assert.equal(data.stops['Busgaden (Aarhus)'][0].time,'16:02');
                assert.equal(data.stops['Busgaden (Aarhus)'][0].direction, 'AUH Skejby');
                done();
            });
        });
    });
});