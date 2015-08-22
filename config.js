var config = {};

config.web = {};
config.aarhusdata = {};
config.parkingretriever = {};

config.web.port = process.env.WEB_PORT || 80;

config.aarhusdata.host = 'www.odaa.dk';
config.aarhusdata.path = '/api/action/datastore_search?resource_id=2a82a145-0195-4081-a13c-b0e587e9b89c';

config.parkingretriever.retrieveinterval = 60000;

module.exports = config;