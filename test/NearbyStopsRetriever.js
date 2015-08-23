var assert = require("chai").assert;
var mockery = require('mockery');
var fs = require('fs');
require('array.prototype.find');

describe('NearbyStopsRetriever', function() {

    var cnt = 0;
    var helperStub = {
        makeRequest : function(host, path,params, callback){
            cnt++;
            if(cnt == 2) {
                callback(new Error("EEE"));
                return;
            }
            fs.readFile(__dirname + '/data/stopLocationsResponse.txt', function (err, data) {
                if (err) {
                    throw err;
                }
                callback(null, data);
            });
        }
    }

    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
    });

    beforeEach(function() {
        mockery.registerMock('./HttpHelper', helperStub);
        retriever = require("./../lib/NearbyStopsRetriever");
    });

    afterEach(function(){
        mockery.deregisterAll();
    });

    after(function(){
        mockery.disable();
    });

    describe('#RetrieveStops()', function () {
        it('Should parse responses correctly', function (done) {
            var lat = 56.12343;
            var lng = 10.23423;
            retriever.RetrieveStops(lat, lng, function(err, data){
                assert.equal(data.length, 3);
                assert.notEqual(data.indexOf('751414900'), -1);
                assert.notEqual(data.indexOf('751414400'), -1);
                assert.notEqual(data.indexOf('751415000'), -1);
                done();
            });
        });
        it('Should give error in case of no response', function (done) {
            var lat = 56.12343;
            var lng = 10.23423;
            retriever.RetrieveStops(lat, lng,function(err, data){
                assert.isOk(err);
                done();
            })
        });
    });
});