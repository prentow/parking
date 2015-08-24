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

Backend
-----------

node.js
mocha...
logging osv.

# API

Frontend
----------






