var assert = require("chai").assert;
var mockery = require('mockery');
var fs = require('fs');
require('array.prototype.find');

describe('AarhusParkingRetriever', function() {

    var cnt = 0;
    var helperStub = {
        makeRequest : function(host, path,params, callback){
            cnt++;
            if(cnt == 2) {
                callback(new Error("EEE"));
                return;
            }
            fs.readFile( __dirname + '/data/odaResponse.txt', function (err, data) {
                if (err) {
                    throw err;
                }
                callback(null, data);
            });
        }
    }

    var badHelperStub = {
        makeRequest : function(host, path,params, callback){
            callback(new Error("Error occured!"));
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
        retriever = require("./../lib/AarhusParkingRetriever").ParkingRetriever();
    });

    afterEach(function(){
        mockery.deregisterAll();
    });

    after(function(){
        mockery.disable();
    });

    describe('#retrieveData()', function () {
        it('Should parse response correctly', function (done) {
            retriever.retrieveData(function(err, data){
                assert.isTrue(!err);
                assert.equal(data.length, 9);
                var salling = data.find(function(a) {return a.name == 'Salling';});
                assert.ok(salling);
                assert.equal(salling.capacity, 700);
                assert.equal(salling.count, 458);
                assert.equal(salling.coords.lat, 56.15390545875265);
                assert.equal(salling.coords.lng, 10.20764770141504);
                done();
            })
        });
        it('Should give error in case of no response', function (done) {
            retriever.retrieveData(function(err, data){
                assert.isOk(err);
                done();
            })
        });
    });
});
