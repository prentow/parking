var http = require('http');

function makeRequest(host, path, callback){
    var options = {
        host: host,
        path: path
    };
    var req = http.get(options, function(res) {
        if(res.statusCode != 200){
            console.log("Bad status code from http request: " + res.statusCode);
            callback(new Error("Bad status code from http request " + res.statusCode));
        }
        var bodyChunks = [];
        res.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            callback(null, body);
        })
    });
    req.on('error', function(e) {
        console.log('Could not retrieve data: ' + e.message);
        callback(new Error("Could not retrieve data: " + e.message));
    });
};

module.exports.makeRequest = makeRequest;