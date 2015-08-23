var http = require('http');

function makeRequest(host, path, params, callback){
    var options = {
        host: host,
        path: path
    };
    if(params != null)
        options.path += buildParams(params);
    var req = http.get(options, function(res) {
        if(res.statusCode != 200){
            callback(new Error("Bad status code from http request " + res.statusCode));
            return;
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
        callback(new Error("Could not retrieve data: " + e.message));
    });
};

function buildParams(params){
    var path = "";
    for(var name in params){
        if(path != "")
            path +="&";
        path += name + "=" + params[name];
    }
    return "?" + path;
}

module.exports.makeRequest = makeRequest;