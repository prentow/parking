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

    setMarkers();
}

var markers = []

function setMarkers(){
    httpGetAsync("/parking", retrievedPositions);
}

function clearMarkers(){
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    markers = [];
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
    clearMarkers();
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
        markers.push(parkings[pinfo].marker);
        parkings[pinfo].marker.addListener('click', showWindow(parkings[pinfo].marker, parkings[pinfo]));
    }
    setTimeout(function () {
        setMarkers();
    },60000);
}

function showWindow(marker, pinfo){
    return function() {
        httpGetAsync("/stops?lat=" + pinfo.coords.lat + "&lng=" + pinfo.coords.lng, function(body){
            var stopinfo = JSON.parse(body);
            var stopnames = stopinfo.stopnames;
            var cnt = "<h3>" + pinfo.name + "</h3>";
            cnt += "<b>" + pinfo.count + "</b> of <b>" + pinfo.capacity + "</b> spaces occupied.";
            cnt += '<br>Connections at the following stops:<br>';
            for(var i in stopnames){
                cnt += "<br><b>";
                cnt += stopnames[i] + "</b>";
                var stops = stopinfo.stops[stopnames[i]];
                cnt += "<table>"
                for(var j in stops){
                    cnt += "<tr><td>" + stops[j].time + "</td><td>" + stops[j].name + "</td><td>-> "  + stops[j].direction + "</tr></td>";
                }
                cnt += "</table>"
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
    marker.addListener('click', showUserWindow(marker, position));
}

function showUserWindow(marker,position){
    return function() {
        httpGetAsync("/distances?lat=" + position.coords.latitude + "&lng=" + position.coords.longitude, function(body){
            var distancesInfo = JSON.parse(body);
            var cnt = "<h3>Distances</h3>";
            cnt += "<table>"
            for(var i in distancesInfo){
                if(distancesInfo[i] != null)
                    cnt += "<tr><td><b>" + distancesInfo[i].name + ":</b></td><td>" +  distancesInfo[i].durationText + "</td><td>" + distancesInfo[i].distanceText + "</td></tr>";
            };
            cnt += "</table>";
            var infowindow = new google.maps.InfoWindow({
                content: cnt
            });
            infowindow.open(window.map, marker);
        });
    }
}

google.maps.event.addDomListener(window, 'load', initialize);