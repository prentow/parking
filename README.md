Aarhus Parking Availability
===========================

The applications provides real-time information on availability of parking spots in at car parks in Aarhus. When the users location is available, travel times and distances to the car parks are given.
In addition information is provided on departing public transportation options from each car park in the near future.

Data Sources
------------
Data is used from the following sources:
    * Real-time information on avaiability in car parks is retrieved from [Open Data Aarhus](http://www.odaa.dk/dataset/parkeringshuse-i-aarhus). This provides, for each car park, the current number of parked cars and the total capacity. The numbers are updated every 5 minutes.
    * Real-time information on departing public transportation. This is retrieved from the open API of [Rejseplanen](http://labs.rejseplanen.dk/api). Two services are used, one for retrieving stops close to a locations, and one for retrieving departures at the stops.
    * Travel time and distance information, from user to each of the car parks, is retrieved through Googles [distances-matrix service](https://developers.google.com/maps/documentation/javascript/distancematrix), through the use of a node.js module.

Usage
------------
The application is available at [http://parking.thorprentow.dk](http://parking.thorprentow.dk).
It shows a map of Aarhus, with a marker for each of the car parks. Each marker shows the current availability through a fill level and a color.
    * Hovering above a marker shows the name of the car park, and the current and total number of parking spaces.
    * Clicking a marker opens an info window, which shows information on departing public transportation at stops close to the car park.
    * When user location is available, a car marker will show at the users location. Clicking this marker will open an info window, which shows a list of travel times and distances to each of the car parks.

Pictures


Deployment
------------
Requires:
    * Node.js installation with npm
Steps:
    * run 'npm install'
    * run 'node index.js'

Configuration
-----------
The application is configured through the config.js file.

Backend
-----------
The backend is build on the Node.js platform and the Express web application framework.

The source is available in /lib.

### Testing
The application uses the Mocha framework for testing.
Run all tests using the 'mocha' command.

### Logging
The application uses log4js for logging.
Logging can be configured in log4js.config

### Web services API

The application exposes three HTTP REST webservice interfaces. Results are JSON formatted.

#### GET /parking

Returns a JSON array with information on car park availability in the following JSON format:

```
[
    {
        "name" : string,
        "coords" :
        {
            "lat" : float,
            "lng" : float
        },
        "capacity" : int,
        "count": int
    },
    ...
]
```

The service is implemented mainly in [AarhusParkingRetriever](lib/AarhusParkingRetriever.js).

#### GET /stops?lat=[float]&lng=[float]

Returns information on departing transportation from stops in the configured vicinity of the given (lat,lng) location in the following format.
If no stops are nearby, return code is 404.

```
{
    "stopnames" : ['stopname1','stopname2'...],
    "stops" : {
        "stopname1" : [
            {
                "name" : string,
                "stop" : string,
                "time" : string,
                "direction" : string
            },
            ...
        ],
        "stopname2" : ...
    }
}
```

The service is implemented through [NearbyStopsRetriever](lib/NearbyStopsRetriever.js) and [StopConnectionsRetriever](lib/StopConnectionsRetriever.js).

#### GET /distances?lat=[float]&lng=[float]

Returns travel time and distance information from the given (lat,lng) position to each of the car parks. The resulting list contains information only for those car parks for which travel times and distances could be computed.
Thus the list may be empty if, e.g., an ocean is in the way.

```
[
    {
        "distanceText" : string,
        "durationText" : string,
        "distance" : int(m),
        "duration" : int(s),
        "name"
    },
    ...
]
```


The service is implemented mainly in [DistanceRetriever](lib/DistanceRetriever.js).

Frontend
----------

The front end uses the Google Maps javascript API to visualize the data on a map.
When the page is loaded, the /parking service is called to draw markers and parking availability.
When a car park marker is clicked, the /stops service is called in order to retrieve information on departures, which is shown to the user in an info window.

When the page is loaded, the users location is requested. If this is retrieved, a car marker is drawn to show the users position. If this marker is clicked, the
/distances service is called, in order to retrieve information on the travel times and distances to the car parks from the user location. The user are informed of these in an info window.




