var express = require('express');
var http = require('http');
var config = require('./config');
var app = express();

var pdata = new Object();

app.use(express.static(__dirname + '/web'));

app.set('port', config.web.port);

app.get('/parking', function(request, response) {
    response.send(200, JSON.stringify(pdata));
});

app.get('/base64', function(request, response) {
    var stringToEncode = request.query.s;
    var base64EncodedString = new Buffer(stringToEncode, 'utf8').toString('base64');
    response.send(200, base64EncodedString);
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

function ParkingHouse (name) {
    this.name = name;
    this.lat = 56.1572;
    this.long = 10.2107;
    this.capacity = 200;
    this.current = 150;
}

var nameLocMap = new Object();
nameLocMap['NORREPORT'] = {lat: 56.16184778799529, lng:10.21258195203404};
nameLocMap['SCANDCENTER'] = {lat: 56.15164989546772, lng: 10.19840765815879};
nameLocMap['BRUUNS'] = {lat: 56.14987481709147, lng: 10.20609304489349};
nameLocMap['NewBusgadehuset'] = {lat: 56.15532574386194, lng: 10.20613738198009};
nameLocMap['MAGASIN'] = {lat: 56.15674483398173, lng: 10.20492314504883};
nameLocMap['KALKVAERKSVEJ'] = {lat: 56.14957786404207, lng: 10.21122275310017};
nameLocMap['SALLING'] = {lat: 56.15390545875265, lng: 10.20764770141504};
nameLocMap['Navitas'] = {lat: 56.15986622043042, lng: 10.21680929819052};
nameLocMap['Urban Level 1'] = {lat: 56.15402792829961, lng: 10.21370572644181};
nameLocMap['Urban Level 2+3'] = {lat: 56.15396301219192, lng: 10.21350598245308};

retrieveLoop();

function retrieveLoop(){
    var parkings = [];
    var options = {
        host: 'www.odaa.dk',
        path: '/api/action/datastore_search?resource_id=2a82a145-0195-4081-a13c-b0e587e9b89c'
    };
    var req = http.get(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            console.log('BODY: ' + body);
            // ...and/or process the entire body here.
            var resp = JSON.parse(body);
            var parkinginfos = resp.result.records;
            for(var pinfo in parkinginfos){
                if(nameLocMap[parkinginfos[pinfo].garageCode] != null) {
                    parkings.push(new ParkingHouse(parkinginfos[pinfo].garageCode));
                    parkings[parkings.length - 1].lat = nameLocMap[parkinginfos[pinfo].garageCode].lat;
                    parkings[parkings.length - 1].long = nameLocMap[parkinginfos[pinfo].garageCode].lng;
                    parkings[parkings.length - 1].capacity = parkinginfos[pinfo].totalSpaces;
                    parkings[parkings.length - 1].count = parkinginfos[pinfo].vehicleCount;
                }

            }
            pdata = parkings;
        })
    });

    req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });

    setTimeout(function () {
        retrieveLoop();
    }, 60000);
}


