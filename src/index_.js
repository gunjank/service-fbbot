'use strict';

var config = require('config'),
    path = require('path'),
    glob = require('glob'),
    args = require('argify'),
    Lout = require('lout'),
    Good = require('good'),
    GoodFile = require('good-file'),
    bunyan = require('bunyan'),
    q = require('q'),
    Hapi = require('hapi'),
    Inert = require('inert'),
    Vision = require('vision'),
    HapiSwagger = require('hapi-swagger'),
    Pack = require('../package'),
    bot = require('./lib/bot'),
    settings = require('./config/settings')

global.log = bunyan.createLogger({
    name: 'node-fbbot'
});

/**
 * Construct the server
 */
var server = new Hapi.Server({
    connections: {
        routes: {
            cors: true,
            log: true
        },
        router: {
            stripTrailingSlash: true
        }
    }
});
log.info('server constructed');
/**
 * Create the connection
 */
// port: config.port

server.connection({
    port: process.env.PORT || 3000

});
var swaggerOptions = {
    info: {
        'title': 'FBBOT API Documentation',
        'version': Pack.version
    }
};
//used for Swagger and other view components
server.register([Inert, Vision, {
    'register': HapiSwagger,
    'options': swaggerOptions
}], function (err) {
    err ? log.info("Inert or Vision plugin failed, it will stop swagger") : log.info("Inert or Vision plugin registered, it will start  swagger");
});

/**
 * Build a logger for the server & each service
 */
var reporters = [new GoodFile({
    log: '*'
}, __dirname + '/../logs/server.log')];

/**
 * Add logging
 */
server.register({
    register: Good,
    options: {
        opsInterval: 1000,
        reporters: reporters
    }
}, function (err) {
    if (err) throw new Error(err);
    console.log('Plugin loaded: Good');
    log.debug('registered Good for logging with reporters: ', reporters);
});

/**
 * Add /docs route
 */
server.register({
    register: Lout
}, function (err) {
    if (err) throw new Error(err);
    console.log('Plugin loaded: Lout');
    log.debug('added Lout for /docs');
});
//default page or view
server.route({
    method: 'get',
    path: '/{param*}',
    handler: {
        directory: {
            path: __dirname + '/../public',
            listing: true
        }
    }
});
//** start your server **/
server.start(function (err) {
    if (err) throw new Error(err);
    log.info('server started!');
    var summary = server.connections.map(function (cn) {
        return {
            labels: cn.settings.labels,
            uri: cn.info.uri
        };
    });
    // var faqService = require(__dirname + '/routes/citibikeRoutes')(server);
    console.log(summary);
    log.info('Connections: ', summary);
    server.log('server', 'started: ' + JSON.stringify(summary));
});

server.route({
    path: '/',
    method: 'GET',
    handler: (req, reply) => {
        reply(bot._verify(req, reply));
    }
});
server.route({
    path: '/',
    method: 'POST',
    handler: (request, reply) => {
        bot._handleMessage(req.body)
        reply({
            status: 'ok'
        });
    }
});


module.exports = server;