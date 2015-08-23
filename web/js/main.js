function initialize() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(retrievedUserPosition)
    }

    var mapOptions = {
        center: {lat: config.coords.lat, lng: config.coords.lng},
        zoom: config.zoomLvl
    };

    window.map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    httpGetAsync("/parking", retrievedPositions);
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function retrievedPositions(response)
{
    var parkings = JSON.parse(response);
    for(var pinfo in parkings){
        var capacity = parkings[pinfo].capacity;
        var count = parkings[pinfo].count;
        var img = Math.floor(count/capacity*6) +1;
        parkings[pinfo].marker = new google.maps.Marker({
            position: parkings[pinfo].coords,
            map: window.map,
            title: parkings[pinfo].name + ": " + parkings[pinfo].count + "/" + parkings[pinfo].capacity,
            icon: 'img/park' + img + '.png'
        });
        parkings[pinfo].marker.addListener('click', showWindow(parkings[pinfo].marker, parkings[pinfo]));
    }
}

function showWindow(marker, pinfo){
    return function() {
        httpGetAsync("/stops?lat=" + pinfo.coords.lat + "&lng=" + pinfo.coords.lng, function(body){
            var stopinfo = JSON.parse(body);
            var stopnames = stopinfo.stopnames;
            var cnt = "<h3>" + pinfo.name + "</h3>";
            cnt += pinfo.count + " of " + pinfo.capacity + " spaces occupied.";
            cnt += '<br>Onwards connections at the following stops:';
            for(var i in stopnames){
                cnt += "<br><br><b>";
                cnt += stopnames[i] + "</b>";
                var stops = stopinfo.stops[stopnames[i]];
                for(var j in stops){
                    cnt += "<br>";
                    cnt += stops[j].time + ": " + stops[j].name + " -> "  + stops[j].direction;
                }
            };
            var infowindow = new google.maps.InfoWindow({
                content: cnt
            });
            infowindow.open(window.map, marker);
        });
    }
}

function retrievedUserPosition(position) {
    var marker = new google.maps.Marker({
        position: {lat: position.coords.latitude, lng: position.coords.longitude},
        map: window.map,
        title: 'You!',
        icon: 'img/sportscar.png'
    });
}

google.maps.event.addDomListener(window, 'load', initialize);