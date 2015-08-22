
function initialize() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(retrievedUserPosition)
    }

    var mapOptions = {
        center: {lat: 56.1572, lng: 10.2107},
        zoom: 15
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
            title: parkings[pinfo].name + " " + parkings[pinfo].count + "/" + parkings[pinfo].capacity,
            icon: 'img/park' + img + '.png'
        });
        parkings[pinfo].marker.addListener('click', showWindow(parkings[pinfo].marker, parkings[pinfo]));
    }
}

function showWindow(marker, pinfo){
    return function() {
        console.log(pinfo.coords);
        httpGetAsync("/stops?lat=" + pinfo.coords.lat + "&lng=" + pinfo.coords.lng, function(body){
            var stopinfo = JSON.parse(body);
            var cnt = pinfo.name + " is occupied by " + pinfo.count + " cars, of a capacity of " + pinfo.capacity;
            for(var i in stopinfo){
                cnt += "<br>";
                cnt += stopinfo[i].name;
            }
            new google.maps.InfoWindow({
                content: cnt
            }).open(map, marker);
        });


    }
}

function setMarker()
{
    var parkPos = {lat: 56.1572, lng: 10.2107};
    var marker = new google.maps.Marker({
        position: parkPos,
        map: window.map,
        title: 'Hello World!'
    });
}

function retrievedUserPosition(position) {
    var marker = new google.maps.Marker({
        position: {lat: position.coords.latitude, lng: position.coords.longitude},
        map: window.map,
        title: 'You!',
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });
}

google.maps.event.addDomListener(window, 'load', initialize);