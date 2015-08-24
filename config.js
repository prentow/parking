var config = {};

config.web = {};
config.aarhusdata = {};
config.parkingretriever = {};
config.busesretriever = {};
config.busesretriever.path = {};

config.web.port = 80;

config.aarhusdata.host = 'www.odaa.dk';
config.aarhusdata.path = '/api/action/datastore_search?resource_id=2a82a145-0195-4081-a13c-b0e587e9b89c';

//The interval at which information is retrieved from the available parking service
config.parkingretriever.retrieveinterval = 60000;

config.busesretriever.host = 'xmlopen.rejseplanen.dk';
config.busesretriever.path.stopsnearby = '/bin/rest.exe/stopsNearby';
config.busesretriever.path.departureboard = '/bin/rest.exe/multiDepartureBoard';
//The maximum number of connections to return in a request
config.busesretriever.maxconnections = 10;
//Timezone where the car parks are located
config.busesretriever.bustimezone = 'Europe/Berlin';

module.exports = config;