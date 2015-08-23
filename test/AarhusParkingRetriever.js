var assert = require("chai").assert;
var should = require('chai').should()
var mockery = require('mockery');
var fs = require('fs');
require('array.prototype.find');


var cnt = 0;
var helperStub = {
    makeRequest : function(host, path, callback){
        cnt++;
        if(cnt == 2) {
            callback(new Error("EEE"));
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
    makeRequest : function(host, path, callback){
        callback(new Error("Error occured!"));
    }
}

describe('AarhusParkingRetriever', function() {
    before(function(){
        mockery.enable();
    });

    beforeEach(function() {
        mockery.registerAllowable('http');
        mockery.registerAllowable('./../config');
        mockery.registerAllowable('./AarhusParkingMap');
        mockery.registerMock('./HttpHelper', helperStub);
        mockery.registerAllowable('./../lib/AarhusParkingRetriever', true);
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
                assert.equal(data.length, 10);
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
