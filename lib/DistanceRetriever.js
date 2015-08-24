var distance = require('google-distance-matrix');
distance.key('');
distance.units('metric');

/**
 * Retrieves distances and travel times between an origin and several destinations
 *
 * @param origin The point from which to retrieve distances: {"lat": float, "lng" : float}
 * @param destinations The locations for which distances should be computed to: [{"lat" : float, "lng" : float},...]
 * @param callback function (err, result), called with (null, result) or (error) if an error occurs.
 */
function RetrieveDistances(origin, destinations, callback){
    var dests = [];
    for(var dest in destinations){
        dests.push(destinations[dest].lat + ',' + destinations[dest].lng);
    }
    distance.matrix([origin.lat + ',' + origin.lng], dests, function (err, distances) {
        if (err) {
            callback(err);
            return;
        }
        if(!distances) {
            callback(new Error("No distances"));
            return;
        }
        if (distances.status == 'OK') {
            var dists = [];
            var origin = distances.origin_addresses[0];
            for (var j = 0; j < destinations.length; j++) {
                var destination = distances.destination_addresses[j];
                if (distances.rows[0].elements[j].status == 'OK') {
                    dists.push({
                        distanceText : distances.rows[0].elements[j].distance.text,
                        durationText : distances.rows[0].elements[j].duration.text,
                        distance : distances.rows[0].elements[j].distance.value,
                        duration : distances.rows[0].elements[j].duration.value
                        });
                } else {
                    dists.push(null);
                }
            }
            callback(null, dists);
        } else {
            callback(new Error("No distances"));
            return;
        }
    });
}

module.exports.RetrieveDistances = RetrieveDistances;