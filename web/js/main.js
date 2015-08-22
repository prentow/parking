
function initialize() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition)
    }

    var mapOptions = {
        center: {lat: 56.1572, lng: 10.2107},
        zoom: 8
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
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function retrievedPositions(response)
{
    var parkings = JSON.parse(response);
    console.log(response);
    for(var pinfo in parkings){
        var parkPos = {lat: parkings[pinfo].lat, lng: parkings[pinfo].long};
        var marker = new google.maps.Marker({
            position: parkPos,
            map: window.map,
            title: parkings[pinfo].name + " " + parkings[pinfo].count + "/" + parkings[pinfo].capacity
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


function setPosition(position) {
   // var mapOptions = {
   //     center: {lat: position.coords.latitude, lng: position.coords.longitude},
   //     zoom: 12
   // };
   // window.map = new google.maps.Map(document.getElementById('map-canvas'),
   //     mapOptions);
    var parkPos = {lat: position.coords.latitude, lng: position.coords.longitude};
    var marker = new google.maps.Marker({
        position: parkPos,
        map: window.map,
        title: 'You!',
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });
}

google.maps.event.addDomListener(window, 'load', initialize);