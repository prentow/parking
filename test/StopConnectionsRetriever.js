var assert = require("chai").assert;
var mockery = require('mockery');
var fs = require('fs');
require('array.prototype.find');

var helperStub = {
    makeRequest : function(host, path,params, callback){
        fs.readFile(__dirname + '/data/nearbyConnectionsResponse.txt', function (err, data) {
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
        retriever = require("./../lib/StopConnectionsRetriever");
    });

    afterEach(function(){
        mockery.deregisterAll();
    });

    after(function(){
        mockery.disable();
    });

    describe('#RetrieveStops()', function () {
        it('Should parse responses correctly', function (done) {
            var idList = ['751414900', '751414400', '751415000'];
            retriever.RetrieveConnections(idList, function(err, data){
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